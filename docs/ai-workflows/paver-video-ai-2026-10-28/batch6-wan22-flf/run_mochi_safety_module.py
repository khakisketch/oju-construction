"""Run isolated, native ComfyUI Mochi text-to-video experiments.

Uses an API graph extracted from the official ComfyUI example. Everything,
including the server, models, output PNGs, logs and temporary database, stays
under this directory. Inference stops if another compute workload appears or
memory headroom is low. No custom or remote API nodes are enabled.
"""
import copy
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parent
API = json.loads((ROOT / "official-example-api.json").read_text())
MIN_START_MIB = 75 * 1024
MIN_DURING_MIB = 40 * 1024
MAX_SECONDS_PER_VIDEO = 1200
CASES = {
    32: (
        2026102932,
        "Locked-off real-world documentary shot looking across an ordinary gray "
        "concrete paver sidewalk at a low angle in soft overcast daylight. "
        "A small local patch of two adjacent rectangular pavers gradually settles "
        "a few centimeters downward. Each block stays straight and rigid, separate "
        "from its neighbors. The surrounding pavers, their joints, the ground and "
        "the camera stay completely still. No people, no tools, no new objects. "
        "Photorealistic construction materials, one continuous fixed shot.",
    ),
    33: (
        2026102933,
        "Locked-off documentary close-up of an actual-scale excavated sidewalk "
        "edge viewed from the side. Clearly visible rectangular concrete pavers "
        "above a thin sand bedding and compact granular support; below, a single "
        "gray hollow drainage pipe crosses the brown soil. Near a small crack in "
        "the pipe, a small trickle of fine soil grains falls toward the opening. "
        "The pipe, paving blocks, surrounding soil, and camera remain still. "
        "Natural overcast daylight and realistic textures. No people or tools. "
        "One continuous close view, no words or labels.",
    ),
    34: (
        2026102934,
        "Tripod-locked documentary view down at an ordinary outdoor gray concrete "
        "paver pedestrian sidewalk in overcast daylight. A small irregular shallow "
        "rain puddle already lies in a slight low area among the blocks. Light "
        "rain produces several subtle ripples on the clear water while the individual "
        "rectangular pavers, joints and camera remain completely stationary. No "
        "people, no drain, no floating objects. Natural realistic concrete texture, "
        "soft diffuse light, a single continuous fixed shot.",
    ),
}


def available_mib():
    for line in Path("/proc/meminfo").read_text().splitlines():
        if line.startswith("MemAvailable:"):
            return int(line.split()[1]) // 1024
    raise RuntimeError("Cannot read memory headroom")


def compute_processes():
    result = subprocess.run(
        ["nvidia-smi", "--query-compute-apps=pid,process_name", "--format=csv,noheader,nounits"],
        check=True, capture_output=True, text=True, timeout=8,
    )
    entries = []
    for line in result.stdout.splitlines():
        parts = line.split(",", 1)
        if len(parts) == 2 and parts[0].strip().isdigit():
            entries.append((int(parts[0]), parts[1].strip()))
    return entries


def get_json(url, data=None, timeout=8):
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return json.load(response)


def write_new(path, body):
    with path.open("x", encoding="utf-8") as out:
        out.write(body)


def safety_check(server_pid, allowed_baseline):
    mib = available_mib()
    if mib < MIN_DURING_MIB:
        raise RuntimeError(f"Stopped for shared-memory safety: MemAvailable={mib} MiB")
    others = [(pid, name) for pid, name in compute_processes()
              if pid != server_pid and pid not in allowed_baseline]
    if others:
        raise RuntimeError(f"Stopped because another GPU compute process appeared: {others}")
    return mib


def make_graph(index):
    seed, text = CASES[index]
    g = copy.deepcopy(API)
    g["37"]["inputs"]["unet_name"] = "mochi_preview_fp8_scaled.safetensors"
    g["38"]["inputs"]["clip_name"] = "t5xxl_fp8_e4m3fn_scaled.safetensors"
    g["6"]["inputs"]["text"] = text
    g["7"]["inputs"]["text"] = ""  # Official example uses an empty negative.
    g["21"]["inputs"].update(width=640, height=384, length=49, batch_size=1)
    g["3"]["inputs"].update(seed=seed, steps=30, cfg=4.5, sampler_name="euler", scheduler="simple", denoise=1.0)
    # Preserve every decoded frame; MP4 review files are encoded separately.
    g["28"] = {"class_type": "SaveImage", "inputs": {"images": ["8", 0], "filename_prefix": f"candidate-{index}"}}
    return {"client_id": "oju-mochi-local", "prompt": g}


def main():
    indexes = [int(x) for x in sys.argv[1:]]
    if not indexes or len(set(indexes)) != len(indexes) or any(x not in CASES for x in indexes):
        raise SystemExit("Pass one or more distinct case numbers: 32, 33, 34")
    for filename in ["models/diffusion_models/mochi_preview_fp8_scaled.safetensors",
                     "models/text_encoders/t5xxl_fp8_e4m3fn_scaled.safetensors",
                     "models/vae/mochi_vae.safetensors"]:
        if not (ROOT / filename).is_file():
            raise RuntimeError(f"Verified model missing: {filename}")
    for i in indexes:
        for suffix in ("json", "history.json"):
            if (ROOT / f"candidate-{i}-{suffix}" if suffix == "history.json" else ROOT / f"candidate-{i}.{suffix}").exists():
                raise RuntimeError(f"Existing candidate file for {i}; refusing to overwrite")
    start_mib = available_mib()
    if start_mib < MIN_START_MIB:
        raise RuntimeError(f"Not starting with only {start_mib} MiB available")
    initial = compute_processes()
    foreign = [(pid, name) for pid, name in initial if not name.endswith("gnome-remote-desktop-daemon")]
    if foreign:
        raise RuntimeError(f"Another GPU compute workload is active: {foreign}")
    baseline = {pid for pid, _ in initial}
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as reservation:
        reservation.bind(("127.0.0.1", 0))
        port = reservation.getsockname()[1]
    base = f"http://127.0.0.1:{port}"
    for folder in ("input", "output", "temp", "user"):
        (ROOT / folder).mkdir(exist_ok=True)
    args = ["nice", "-n", "15", "ionice", "-c", "3",
            "/home/ksi/ComfyUI/.venv/bin/python", "/home/ksi/ComfyUI/main.py",
            "--listen", "127.0.0.1", "--port", str(port), "--base-directory", str(ROOT),
            "--models-directory", str(ROOT / "models"), "--disable-auto-launch", "--offline",
            "--disable-all-custom-nodes", "--disable-assets", "--vram-headroom", "24"]
    env = os.environ.copy()
    env.update({"OMP_NUM_THREADS": "2", "OPENBLAS_NUM_THREADS": "2", "MKL_NUM_THREADS": "2",
                "COMFYUI_DISABLE_PRODUCT_TIPS": "1"})
    print(f"Start MemAvailable={start_mib} MiB; baseline GPU compute={initial}", flush=True)
    with (ROOT / "server.log").open("a", encoding="utf-8") as logfile:
        proc = subprocess.Popen(args, cwd="/home/ksi/ComfyUI", env=env, stdout=logfile, stderr=subprocess.STDOUT)
        print(f"Owned server PID {proc.pid}, loopback port {port}; cmd={args}", flush=True)
        try:
            deadline = time.monotonic() + 120
            while True:
                if proc.poll() is not None:
                    raise RuntimeError(f"Owned server exited during startup: {proc.returncode}")
                if time.monotonic() > deadline:
                    raise RuntimeError("Owned server failed to start in 120 seconds")
                safety_check(proc.pid, baseline)
                try:
                    get_json(base + "/system_stats", timeout=2)
                    listing = subprocess.run(["ss", "-H", "-lntp", "sport", "=", f":{port}"],
                                             text=True, capture_output=True, check=True, timeout=5).stdout
                    if f"pid={proc.pid}," not in listing:
                        raise RuntimeError(f"Port {port} is not owned by our server: {listing}")
                    break
                except (urllib.error.URLError, TimeoutError):
                    time.sleep(2)
            for index in indexes:
                start = time.monotonic()
                min_mib = safety_check(proc.pid, baseline)
                if min_mib < MIN_START_MIB:
                    raise RuntimeError(f"Not starting candidate {index}: MemAvailable={min_mib} MiB")
                payload = make_graph(index)
                write_new(ROOT / f"candidate-{index}.json", json.dumps(payload, indent=2) + "\n")
                submission = get_json(base + "/prompt", data=json.dumps(payload).encode(), timeout=10)
                prompt_id = submission.get("prompt_id")
                if not prompt_id:
                    raise RuntimeError(f"Prompt not accepted: {submission}")
                print(f"Candidate {index}: prompt_id={prompt_id}, starting {time.ctime()}", flush=True)
                while True:
                    if proc.poll() is not None:
                        raise RuntimeError(f"Server exited while generating candidate {index}: {proc.returncode}")
                    min_mib = min(min_mib, safety_check(proc.pid, baseline))
                    if time.monotonic() - start > MAX_SECONDS_PER_VIDEO:
                        raise RuntimeError(f"Candidate {index} exceeded {MAX_SECONDS_PER_VIDEO}s")
                    history = get_json(base + "/history/" + prompt_id)
                    if prompt_id in history:
                        result = history[prompt_id]
                        write_new(ROOT / f"candidate-{index}-history.json", json.dumps(result, indent=2) + "\n")
                        status = result.get("status", {}).get("status_str")
                        images = result.get("outputs", {}).get("28", {}).get("images", [])
                        if status != "success" or len(images) != 49:
                            raise RuntimeError(f"Candidate {index} failed: status={status}; images={len(images)}")
                        print(f"Candidate {index} complete: {len(images)} frames; "
                              f"{time.monotonic()-start:.1f}s, sampled min MemAvailable={min_mib} MiB", flush=True)
                        break
                    time.sleep(4)
        finally:
            if proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=20)
                except subprocess.TimeoutExpired:
                    proc.kill()  # This is exclusively the process created above.
                    proc.wait(timeout=10)
            print(f"Owned server stopped, exit={proc.returncode}", flush=True)


if __name__ == "__main__":
    main()

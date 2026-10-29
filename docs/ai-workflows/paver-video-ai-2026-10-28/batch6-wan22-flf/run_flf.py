"""Compare native Wan2.2 first+last conditioning with first-only, locally.

The inputs are rough artificial control images, not field data or accepted
results. No shared models, existing outputs or ComfyUI installation are
modified; the server and new outputs are isolated under this directory.
"""
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import socket
import subprocess
import time
import urllib.error

ROOT = Path(__file__).resolve().parent
PROJECT = Path("/home/ksi/Desktop/SI-Projects/OJU-EC")
SPEC = importlib.util.spec_from_file_location("safety", "/tmp/opencode/oju-paver-mochi-Wfsd9m/run_mochi.py")
SAFE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(SAFE)

WEIGHTS = [
    (Path("/tmp/opencode/oju-video-batch3-5IiH3a/models/diffusion_models/wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors"),
     "6122e79d55e0f235698d11d657f3b196c5273c830da00b2b013c5a048d5e6a42"),
    (Path("/tmp/opencode/oju-video-batch3-5IiH3a/models/diffusion_models/wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors"),
     "5471a457b6ac404202a5fbe6c11595a3d5641fc766b00f38763f72303fffc21e"),
    (Path("/tmp/opencode/oju-paver-wan-v1/models/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors"),
     "c3355d30191f1f066b26d93fba017ae9809dce6c627dda5f6a66eaa651204f68"),
    (Path("/tmp/opencode/oju-paver-wan-v1/models/vae/wan_2.1_vae.safetensors"),
     "2fc39d31359a4b0a64f55876d8ff7fa8d780956ae2cb13463b0223e15148976b"),
]


def sha(path):
    h = hashlib.sha256()
    start = time.monotonic()
    total = 0
    with path.open("rb") as f:
        while True:
            data = f.read(8 * 1024 * 1024)
            if not data:
                break
            h.update(data)
            total += len(data)
            # Limit reads to ~150 MiB/s; leave disk bandwidth for other jobs.
            wait = total / (150 * 1024 * 1024) - (time.monotonic() - start)
            if wait > 0:
                time.sleep(wait)
    return h.hexdigest()


def prepare_inputs():
    for folder in ("input", "output", "temp", "user", "models"):
        (ROOT / folder).mkdir(exist_ok=True)
    records = []
    for p, expected in WEIGHTS:
        actual = sha(p)
        if actual != expected:
            raise RuntimeError(f"Provider hash mismatch for {p.name}: {actual}")
        records.append({"path": str(p), "size": p.stat().st_size, "sha256": actual})
        print(f"Verified {p.name}: {actual}", flush=True)
    SAFE.write_new(ROOT / "verified-models.json", json.dumps(records, indent=2) + "\n")
    yaml = ("batch3:\n  base_path: /tmp/opencode/oju-video-batch3-5IiH3a/models\n"
            "  diffusion_models: diffusion_models\n"
            "previous:\n  base_path: /tmp/opencode/oju-paver-wan-v1/models\n"
            "  text_encoders: text_encoders\n  vae: vae\n")
    SAFE.write_new(ROOT / "models.yaml", yaml)
    source = PROJECT / "docs/ai-workflows/paver-video-ai-2026-10-28/batch5-controls"
    for name in ("rigid-start.png", "rigid-end.png"):
        original, dest = source / name, ROOT / "input" / name
        data = original.read_bytes()
        with dest.open("xb") as f:
            f.write(data)
        print(f"Input {name}: SHA-256 {hashlib.sha256(data).hexdigest()}", flush=True)


def graph(index):
    # Baseline graph uses the verified Wan2.2 I2V expert pair. Replace its
    # conditioning node with the officially documented first/last node.
    base = json.loads((PROJECT / "docs/ai-workflows/paver-video-ai-2026-10-28/candidate-14.json").read_text())
    g = copy.deepcopy(base["prompt"])
    g["5"]["inputs"]["image"] = "rigid-start.png"
    g["15"] = {"class_type": "LoadImage", "inputs": {"image": "rigid-end.png"}}
    g["6"]["inputs"]["text"] = (
        "Fixed tripod view of the same outdoor concrete pavement. One rectangular "
        "block just right of center gently sinks a small amount, while staying "
        "straight, rigid, flat and distinct. All the other blocks and their joints "
        "remain still. Natural daylight, no people, no new objects."
    )
    g["7"]["inputs"]["text"] = (
        "curved seams, bent pavers, changing shape, floating blocks, raised upright "
        "slabs, hatch, holes, extra objects, camera movement, flicker, text, logo, toy, cartoon"
    )
    inputs = g["8"]["inputs"]
    g["8"]["class_type"] = "WanFirstLastFrameToVideo"
    inputs.update(width=640, height=384, length=33, batch_size=1, start_image=["5", 0])
    if index == 35:
        inputs["end_image"] = ["15", 0]
    elif index == 36:
        # Same node, starting image, prompt, seed, sampler and model: control.
        g.pop("15")
    else:
        raise ValueError(index)
    for node in ("11", "12"):
        g[node]["inputs"]["noise_seed"] = 2026102928
    g["14"]["inputs"]["filename_prefix"] = f"candidate-{index}"
    return {"client_id": "oju-wan22-flf-local", "prompt": g}


def main():
    prepare_inputs()
    available = SAFE.available_mib()
    if available < SAFE.MIN_START_MIB:
        raise RuntimeError(f"Insufficient shared memory before server: {available} MiB")
    initial = SAFE.compute_processes()
    others = [(pid, name) for pid, name in initial if not name.endswith("gnome-remote-desktop-daemon")]
    if others:
        raise RuntimeError(f"Another GPU compute workload is active: {others}")
    baseline = {pid for pid, _ in initial}
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as reservation:
        reservation.bind(("127.0.0.1", 0))
        port = reservation.getsockname()[1]
    base = f"http://127.0.0.1:{port}"
    args = ["/home/ksi/ComfyUI/.venv/bin/python", "/home/ksi/ComfyUI/main.py",
            "--listen", "127.0.0.1", "--port", str(port), "--base-directory", str(ROOT),
            "--extra-model-paths-config", str(ROOT / "models.yaml"), "--disable-auto-launch", "--offline",
            "--disable-all-custom-nodes", "--disable-assets", "--vram-headroom", "24"]
    env = os.environ.copy()
    env.update({"OMP_NUM_THREADS": "2", "OPENBLAS_NUM_THREADS": "2", "MKL_NUM_THREADS": "2",
                "COMFYUI_DISABLE_PRODUCT_TIPS": "1"})
    print(f"Start MemAvailable={available} MiB; baseline GPU compute={initial}", flush=True)
    with (ROOT / "server.log").open("x", encoding="utf-8") as logfile:
        proc = subprocess.Popen(args, cwd="/home/ksi/ComfyUI", env=env, stdout=logfile, stderr=subprocess.STDOUT)
        print(f"Owned server PID {proc.pid}, loopback port {port}; cmd={args}", flush=True)
        try:
            deadline = time.monotonic() + 120
            while True:
                if proc.poll() is not None:
                    raise RuntimeError(f"Server exited during startup: {proc.returncode}")
                if time.monotonic() > deadline:
                    raise RuntimeError("Server failed to start within 120 seconds")
                SAFE.safety_check(proc.pid, baseline)
                try:
                    SAFE.get_json(base + "/system_stats", timeout=2)
                    listing = subprocess.run(["ss", "-H", "-lntp", "sport", "=", f":{port}"],
                                             text=True, capture_output=True, check=True, timeout=5).stdout
                    if f"pid={proc.pid}," not in listing:
                        raise RuntimeError(f"Unexpected port owner: {listing}")
                    break
                except (urllib.error.URLError, TimeoutError):
                    time.sleep(2)
            for index in (35, 36):
                start = time.monotonic()
                min_mib = SAFE.safety_check(proc.pid, baseline)
                # For the second case the already-resident model counts toward
                # current use; retain substantial headroom without treating it
                # as if we were loading a second model concurrently.
                min_start = SAFE.MIN_START_MIB if index == 35 else 60 * 1024
                if min_mib < min_start:
                    raise RuntimeError(f"Not starting candidate {index}: MemAvailable={min_mib} MiB")
                payload = graph(index)
                SAFE.write_new(ROOT / f"candidate-{index}.json", json.dumps(payload, indent=2) + "\n")
                result = SAFE.get_json(base + "/prompt", data=json.dumps(payload).encode(), timeout=10)
                pid = result.get("prompt_id")
                if not pid:
                    raise RuntimeError(f"Prompt not accepted: {result}")
                print(f"Candidate {index}: prompt_id={pid}, starting {time.ctime()}", flush=True)
                while True:
                    if proc.poll() is not None:
                        raise RuntimeError(f"Server exited generating {index}: {proc.returncode}")
                    min_mib = min(min_mib, SAFE.safety_check(proc.pid, baseline))
                    if time.monotonic() - start > 1200:
                        raise RuntimeError(f"Candidate {index} exceeded time limit")
                    history = SAFE.get_json(base + "/history/" + pid)
                    if pid in history:
                        response = history[pid]
                        SAFE.write_new(ROOT / f"candidate-{index}-history.json", json.dumps(response, indent=2) + "\n")
                        status = response.get("status", {}).get("status_str")
                        images = response.get("outputs", {}).get("14", {}).get("images", [])
                        if status != "success" or len(images) != 33:
                            raise RuntimeError(f"Candidate {index} failed: status={status}, frames={len(images)}")
                        print(f"Candidate {index} complete: 33 frames, {time.monotonic()-start:.1f}s, "
                              f"sampled min MemAvailable={min_mib} MiB", flush=True)
                        break
                    time.sleep(4)
        finally:
            if proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=20)
                except subprocess.TimeoutExpired:
                    proc.kill()  # Only the exact process this script created.
                    proc.wait(timeout=10)
            print(f"Owned server stopped, exit={proc.returncode}", flush=True)


if __name__ == "__main__":
    main()

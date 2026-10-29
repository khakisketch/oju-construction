"""Internal same-view input experiments; these images are NOT final footage.

Uses Qwen-Image-Edit-2511 in native offline ComfyUI with one or two AI image
inputs. Saved pairs are only candidate inputs for a later video quality gate.
No app, shared preview, shared model path or remote inference is modified.
"""
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

INPUTS = {
    "reference-4.png": PROJECT / "docs/media/paver-ai-candidates-2026-10-28/reference-4.png",
    "reference-5.png": PROJECT / "docs/media/paver-ai-candidates-2026-10-28/reference-5.png",
    "reference-9.png": PROJECT / "docs/media/paver-ai-candidates-2026-10-28/reference-9.png",
    "rigid-end.png": PROJECT / "docs/ai-workflows/paver-video-ai-2026-10-28/batch5-controls/rigid-end.png",
}

# Internal after-state candidates A–C. D attempts to improve a section *start*
# image; it is not an after state and must not be passed to video unreviewed.
CASES = {
    "A": (2026102941, "reference-4.png", None,
          "Edit this same photograph only. The two rectangular paving blocks immediately to the right of "
          "the central vertical joint are now a few centimeters lower together than the surrounding walkway, "
          "forming a subtle shallow dip. Each stone remains solid, flat and rigid with straight edges and "
          "narrow natural joints; no black hole, missing block or floating stone. Preserve the identical "
          "camera angle, paving pattern, concrete texture, lighting and every other block."),
    "B": (2026102942, "reference-4.png", "rigid-end.png",
          "Picture 1 is the original real-looking walkway. Picture 2 is only a rough guide for lowering "
          "the one block immediately right of the central vertical joint. Make a realistic edited end view "
          "of picture 1: that same individual block sits slightly lower, with straight rigid edges and "
          "naturally narrow joints. Repair the harsh black line and overlap of the rough guide. Keep the "
          "camera, light, neighboring pavers, texture, layout and all other features of picture 1 unchanged."),
    "C": (2026102943, "reference-5.png", None,
          "Edit the same photograph of paving and grass. In the middle of the walkway, two adjacent "
          "rectangular paving stones sit a few centimeters lower, tilting slightly into a shallow depression. "
          "The individual stones remain solid and straight with narrow joints; do not add a hole. Preserve "
          "the exact position and shape of all other pavers, all grass, camera angle, perspective, lighting "
          "and concrete texture. This is the same walkway viewed from the same fixed camera."),
    "D": (2026102944, "reference-9.png", None,
          "Make the cut edge of this paving look like a real full-scale excavation, keeping exactly the same "
          "camera angle, paver layout and single visible hollow pipe. Replace the oversized white and black "
          "stones directly beneath the paving with a believable tightly compacted mixture of small crushed "
          "aggregate and sand. Keep the surrounding soil natural and continuous, not a model or plinth; "
          "do not add another pipe, a large hole, labels or new objects."),
}

WEIGHTS = [
    ("models/diffusion_models/qwen_image_edit_2511_fp8mixed.safetensors", 20533762817,
     "c9fdc158e46d3b61ef75f21ae866ca2fe808bf4a53643120d1c1e87c19280a4e"),
    ("models/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors", 9384670680,
     "cb5636d852a0ea6a9075ab1bef496c0db7aef13c02350571e388aea959c5c0b4"),
    ("models/vae/qwen_image_vae.safetensors", 253806246,
     "a70580f0213e67967ee9c95f05bb400e8fb08307e017a924bf3441223e023d1f"),
]


def verify_models():
    records = []
    for name, expected_size, expected_sha in WEIGHTS:
        path = ROOT / name
        if not path.is_file() or path.stat().st_size != expected_size:
            raise RuntimeError(f"Missing or incomplete model: {name}")
        h = hashlib.sha256()
        with path.open("rb") as f:
            for block in iter(lambda: f.read(8 * 1024 * 1024), b""):
                h.update(block)
        actual = h.hexdigest()
        if actual != expected_sha:
            raise RuntimeError(f"Model hash mismatch: {name}, got {actual}")
        records.append({"path": name, "size": expected_size, "sha256": actual})
        print(f"Verified {name} SHA-256 {actual}", flush=True)
    SAFE.write_new(ROOT / "verified-models.json", json.dumps(records, indent=2) + "\n")


def copy_inputs():
    for folder in ("input", "output", "temp", "user"):
        (ROOT / folder).mkdir(exist_ok=True)
    for name, source in INPUTS.items():
        data = source.read_bytes()
        with (ROOT / "input" / name).open("xb") as output:
            output.write(data)
        print(f"Input {name} SHA-256 {hashlib.sha256(data).hexdigest()}", flush=True)


def graph(case):
    seed, filename, second, prompt = CASES[case]
    g = {
        "1": {"class_type": "UNETLoader", "inputs": {"unet_name": "qwen_image_edit_2511_fp8mixed.safetensors", "weight_dtype": "default"}},
        "2": {"class_type": "ModelSamplingAuraFlow", "inputs": {"model": ["1", 0], "shift": 3.1}},
        "3": {"class_type": "CFGNorm", "inputs": {"model": ["2", 0], "strength": 1.0, "pre_cfg": False}},
        "4": {"class_type": "CLIPLoader", "inputs": {"clip_name": "qwen_2.5_vl_7b_fp8_scaled.safetensors", "type": "qwen_image", "device": "default"}},
        "5": {"class_type": "VAELoader", "inputs": {"vae_name": "qwen_image_vae.safetensors"}},
        "6": {"class_type": "LoadImage", "inputs": {"image": filename}},
        "7": {"class_type": "FluxKontextImageScale", "inputs": {"image": ["6", 0]}},
        "8": {"class_type": "TextEncodeQwenImageEditPlus", "inputs": {"clip": ["4", 0], "vae": ["5", 0], "image1": ["7", 0], "prompt": prompt}},
        "9": {"class_type": "TextEncodeQwenImageEditPlus", "inputs": {"clip": ["4", 0], "vae": ["5", 0], "image1": ["7", 0], "prompt": ""}},
        "10": {"class_type": "FluxKontextMultiReferenceLatentMethod", "inputs": {"conditioning": ["8", 0], "reference_latents_method": "index_timestep_zero"}},
        "11": {"class_type": "FluxKontextMultiReferenceLatentMethod", "inputs": {"conditioning": ["9", 0], "reference_latents_method": "index_timestep_zero"}},
        "12": {"class_type": "VAEEncode", "inputs": {"pixels": ["7", 0], "vae": ["5", 0]}},
        "13": {"class_type": "KSampler", "inputs": {"model": ["3", 0], "positive": ["10", 0], "negative": ["11", 0], "latent_image": ["12", 0], "seed": seed, "steps": 40, "cfg": 4.0, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}},
        "14": {"class_type": "VAEDecode", "inputs": {"samples": ["13", 0], "vae": ["5", 0]}},
        "15": {"class_type": "SaveImage", "inputs": {"images": ["14", 0], "filename_prefix": "edit-" + case}},
        "16": {"class_type": "SaveImage", "inputs": {"images": ["7", 0], "filename_prefix": "scaled-input-" + case}},
    }
    if second:
        g["17"] = {"class_type": "LoadImage", "inputs": {"image": second}}
        g["8"]["inputs"]["image2"] = ["17", 0]
        g["9"]["inputs"]["image2"] = ["17", 0]
    return {"client_id": "oju-qwen-edit-local", "prompt": g}


def main():
    available = SAFE.available_mib()
    if available < 85 * 1024:
        raise RuntimeError(f"Insufficient shared memory to start model: {available} MiB")
    initial = SAFE.compute_processes()
    others = [(pid, name) for pid, name in initial if not name.endswith("gnome-remote-desktop-daemon")]
    if others:
        raise RuntimeError(f"Another GPU compute workload is active: {others}")
    baseline = {pid for pid, _ in initial}
    verify_models()
    copy_inputs()
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as reservation:
        reservation.bind(("127.0.0.1", 0))
        port = reservation.getsockname()[1]
    base = f"http://127.0.0.1:{port}"
    args = ["/home/ksi/ComfyUI/.venv/bin/python", "/home/ksi/ComfyUI/main.py", "--listen", "127.0.0.1",
            "--port", str(port), "--base-directory", str(ROOT), "--models-directory", str(ROOT / "models"),
            "--disable-auto-launch", "--offline", "--disable-all-custom-nodes", "--disable-assets", "--vram-headroom", "24"]
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
            for case in CASES:
                start = time.monotonic()
                min_mib = SAFE.safety_check(proc.pid, baseline)
                min_start = 85 * 1024 if case == "A" else 60 * 1024
                if min_mib < min_start:
                    raise RuntimeError(f"Not starting edit {case}: MemAvailable={min_mib} MiB")
                payload = graph(case)
                SAFE.write_new(ROOT / f"edit-{case}.json", json.dumps(payload, indent=2) + "\n")
                result = SAFE.get_json(base + "/prompt", data=json.dumps(payload).encode(), timeout=10)
                pid = result.get("prompt_id")
                if not pid:
                    raise RuntimeError(f"Prompt not accepted: {result}")
                print(f"Edit {case}: prompt_id={pid}, starting {time.ctime()}", flush=True)
                while True:
                    if proc.poll() is not None:
                        raise RuntimeError(f"Server exited generating {case}: {proc.returncode}")
                    min_mib = min(min_mib, SAFE.safety_check(proc.pid, baseline))
                    if time.monotonic() - start > 1200:
                        raise RuntimeError(f"Edit {case} exceeded time limit")
                    history = SAFE.get_json(base + "/history/" + pid)
                    if pid in history:
                        response = history[pid]
                        SAFE.write_new(ROOT / f"edit-{case}-history.json", json.dumps(response, indent=2) + "\n")
                        status = response.get("status", {}).get("status_str")
                        edited = response.get("outputs", {}).get("15", {}).get("images", [])
                        scaled = response.get("outputs", {}).get("16", {}).get("images", [])
                        if status != "success" or len(edited) != 1 or len(scaled) != 1:
                            raise RuntimeError(f"Edit {case} failed: status={status}, edit={len(edited)}, input={len(scaled)}")
                        print(f"Edit {case} complete: {time.monotonic()-start:.1f}s, "
                              f"sampled min MemAvailable={min_mib} MiB", flush=True)
                        break
                    time.sleep(4)
        finally:
            if proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=20)
                except subprocess.TimeoutExpired:
                    proc.kill()  # Only the exact server process created above.
                    proc.wait(timeout=10)
            print(f"Owned server stopped, exit={proc.returncode}", flush=True)


if __name__ == "__main__":
    main()

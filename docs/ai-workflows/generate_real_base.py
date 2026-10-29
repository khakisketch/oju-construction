import os
import shutil
import time
import requests

BASE = "http://127.0.0.1:8188"
OUT_DIR = "/home/ksi/Desktop/SI-Projects/OJU-EC/docs/images/ai-test"
os.makedirs(OUT_DIR, exist_ok=True)
CKPT = "RealVisXL_V5.0_fp16.safetensors"

# NOTE: deliberately photo-first wording. No "visualization / editorial /
# clean composition" — those words push SDXL toward a render look.
positive = (
    "unedited amateur smartphone photo of a lived-in Korean apartment complex parking lot on an overcast afternoon, "
    "eye-level, very slightly tilted framing, "
    "beige 15-story apartment towers with small grid windows, exterior wall-mounted AC outdoor units, "
    "ground-floor piloti columns, worn dark asphalt with faded white parking lines, "
    "a yellow speed bump, round manhole covers, oil stains near parking bays, "
    "stained concrete curb, metal drainage grate along the curb, "
    "a few parked cars far in the background, small playground with green fence in the far distance, "
    "flat gray sky, damp ground but no puddle, natural high-ISO grain, realistic phone-camera dynamic range"
)
negative = (
    "text, letters, numbers, watermark, logo, signature, people, close-up cars, "
    "render, 3d render, illustration, painting, drawing, CGI, video game, anime, "
    "perfect symmetry, perfectly clean, oversaturated, HDR, glowing, blurry, low quality"
)

seeds = [20261101, 20261102]

for seed in seeds:
    workflow = {
        "3": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": CKPT}},
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": 1344, "height": 896, "batch_size": 1},
        },
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": positive, "clip": ["3", 1]}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": negative, "clip": ["3", 1]}},
        "8": {"class_type": "VAELoader", "inputs": {"vae_name": "sdxl_vae.safetensors"}},
        "9": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": 32,
                "cfg": 5.5,
                "sampler_name": "dpmpp_2m",
                "scheduler": "karras",
                "denoise": 1.0,
                "model": ["3", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0],
            },
        },
        "10": {"class_type": "VAEDecode", "inputs": {"samples": ["9", 0], "vae": ["8", 0]}},
        "11": {
            "class_type": "SaveImage",
            "inputs": {"filename_prefix": f"oju/real-base-{seed}", "images": ["10", 0]},
        },
    }

    print(f"submitting base seed {seed}...", flush=True)
    r = requests.post(f"{BASE}/prompt", json={"prompt": workflow, "client_id": "oju-test"}, timeout=30)
    r.raise_for_status()
    prompt_id = r.json()["prompt_id"]
    deadline = time.time() + 300
    while time.time() < deadline:
        history = requests.get(f"{BASE}/history/{prompt_id}", timeout=30).json()
        if prompt_id in history:
            outputs = history[prompt_id].get("outputs", {})
            images = outputs.get("11", {}).get("images", [])
            for image in images:
                src = os.path.join("/home/ksi/ComfyUI/output", image.get("subfolder", ""), image["filename"])
                dst = os.path.join(OUT_DIR, image["filename"])
                shutil.copy2(src, dst)
                print("saved", dst, flush=True)
            if images:
                break
        time.sleep(2)
    else:
        raise SystemExit(f"timed out on seed {seed}")

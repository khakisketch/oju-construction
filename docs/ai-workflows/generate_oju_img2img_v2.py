import json
import os
import shutil
import time
import requests

BASE = "http://127.0.0.1:8188"
OUT_DIR = "/home/ksi/Desktop/SI-Projects/OJU-EC/docs/images/ai-test"
os.makedirs(OUT_DIR, exist_ok=True)

positive = (
    "photorealistic architectural section illustration of a Korean apartment parking lot, "
    "compacted subgrade, granular base, permeable asphalt surface, "
    "perforated drainage pipe in a gravel trench, catch basin, "
    "small puddle at a low point, concrete curb, tree roots, "
    "realistic soil, gravel, asphalt aggregate, wet concrete, "
    "no text, no labels, no numbers, no markers, "
    "overcast daylight, soft shadows, high detail, clean composition, "
    "editorial architectural visualization"
)
negative = (
    "text, letters, numbers, markers, labels, watermark, logo, "
    "distorted geometry, impossible layers, extra pipes, floating objects, "
    "cartoon, low quality, blurry, oversaturated, people, cars, machinery"
)

workflow = {
    "1": {"class_type": "LoadImage", "inputs": {"image": "section-crop.png"}},
    "2": {
        "class_type": "ImageScale",
        "inputs": {
            "image": ["1", 0],
            "upscale_method": "lanczos",
            "width": 1152,
            "height": 448,
            "crop": "disabled",
        },
    },
    "3": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {"ckpt_name": "juggernaut-xl-v9.safetensors"},
    },
    "4": {"class_type": "VAEEncode", "inputs": {"pixels": ["2", 0], "vae": ["8", 0]}},
    "5": {"class_type": "CLIPTextEncode", "inputs": {"text": positive, "clip": ["3", 1]}},
    "6": {"class_type": "CLIPTextEncode", "inputs": {"text": negative, "clip": ["3", 1]}},
    "7": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 20261029,
            "steps": 36,
            "cfg": 6.0,
            "sampler_name": "dpmpp_2m",
            "scheduler": "karras",
            "denoise": 0.68,
            "model": ["3", 0],
            "positive": ["5", 0],
            "negative": ["6", 0],
            "latent_image": ["4", 0],
        },
    },
    "8": {"class_type": "VAELoader", "inputs": {"vae_name": "sdxl_vae.safetensors"}},
    "9": {"class_type": "VAEDecode", "inputs": {"samples": ["7", 0], "vae": ["8", 0]}},
    "10": {
        "class_type": "SaveImage",
        "inputs": {"filename_prefix": "oju/section-photoreal-v2", "images": ["9", 0]},
    },
}

print("submitting img2img v2...", flush=True)
r = requests.post(f"{BASE}/prompt", json={"prompt": workflow, "client_id": "oju-test"}, timeout=30)
r.raise_for_status()
prompt_id = r.json()["prompt_id"]
print("prompt_id", prompt_id, flush=True)

deadline = time.time() + 300
while time.time() < deadline:
    history = requests.get(f"{BASE}/history/{prompt_id}", timeout=30).json()
    if prompt_id in history:
        outputs = history[prompt_id].get("outputs", {})
        images = outputs.get("10", {}).get("images", [])
        for image in images:
            src = os.path.join(
                "/home/ksi/ComfyUI/output",
                image.get("subfolder", ""),
                image["filename"],
            )
            dst = os.path.join(OUT_DIR, image["filename"])
            shutil.copy2(src, dst)
            print("saved", dst, flush=True)
        if images:
            break
    time.sleep(2)
else:
    raise SystemExit("timed out waiting for image")

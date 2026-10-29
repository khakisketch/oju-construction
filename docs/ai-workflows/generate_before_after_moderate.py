import json
import os
import shutil
import time
import requests

BASE = "http://127.0.0.1:8188"
OUT_DIR = "/home/ksi/Desktop/SI-Projects/OJU-EC/docs/images/ai-test"
os.makedirs(OUT_DIR, exist_ok=True)

NEGATIVE = (
    "text, letters, numbers, watermark, logo, signature, people, cars, "
    "cartoon, illustration, low quality, blurry, oversaturated, "
    "distorted perspective, floating objects, abandoned, ruined, overgrown"
)

jobs = [
    {
        "name": "before-moderate",
        "seed": 20261042,
        "prompt": (
            "photorealistic wide-angle photo of a typical Korean apartment parking lot after rain, "
            "one large shallow puddle reflecting the sky, a few cracks and faded white parking lines, "
            "clean concrete curb, well-maintained 15-story apartment buildings in the background, "
            "overcast daylight, realistic, documentary photography, "
            "no text, no watermark, no people, no cars, 3:2"
        ),
    },
    {
        "name": "after-moderate",
        "seed": 20261043,
        "prompt": (
            "photorealistic wide-angle photo of a newly paved parking lot in a typical Korean apartment complex, "
            "smooth dark asphalt, crisp white parking lines, clean concrete curb, metal drainage grate, "
            "well-maintained 15-story apartment buildings in the background, "
            "overcast daylight, realistic, documentary photography, "
            "no text, no watermark, no people, no cars, 3:2"
        ),
    },
]

for job in jobs:
    workflow = {
        "3": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": "juggernaut-xl-v9.safetensors"},
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": 1344, "height": 896, "batch_size": 1},
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": job["prompt"], "clip": ["3", 1]},
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": NEGATIVE, "clip": ["3", 1]},
        },
        "8": {"class_type": "VAELoader", "inputs": {"vae_name": "sdxl_vae.safetensors"}},
        "9": {
            "class_type": "KSampler",
            "inputs": {
                "seed": job["seed"],
                "steps": 30,
                "cfg": 6.5,
                "sampler_name": "dpmpp_2m",
                "scheduler": "karras",
                "denoise": 1.0,
                "model": ["3", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0],
            },
        },
        "10": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["9", 0], "vae": ["8", 0]},
        },
        "11": {
            "class_type": "SaveImage",
            "inputs": {"filename_prefix": f"oju/{job['name']}", "images": ["10", 0]},
        },
    }

    print(f"submitting {job['name']}...", flush=True)
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
        raise SystemExit(f"timed out on {job['name']}")

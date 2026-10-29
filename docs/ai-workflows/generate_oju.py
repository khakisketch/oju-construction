import json
import os
import shutil
import time
import requests

BASE = "http://127.0.0.1:8188"
OUT_DIR = "/home/ksi/Desktop/SI-Projects/OJU-EC/docs/images/ai-test"
os.makedirs(OUT_DIR, exist_ok=True)

positive = (
    "photorealistic isometric cutaway of a Korean apartment parking lot, "
    "cutaway showing compacted subgrade, granular base, permeable asphalt surface, "
    "perforated drainage pipe in a gravel trench, catch basin, "
    "small puddle at a low point, concrete curb, tree roots, "
    "no text, no labels, no watermark, "
    "overcast daylight, soft shadows, architectural visualization, "
    "high detail, 3/4 view, clean composition"
)
negative = (
    "text, letters, numbers, watermark, logo, signature, "
    "distorted geometry, impossible layers, extra pipes, floating objects, "
    "cartoon, illustration, low quality, blurry, oversaturated, "
    "people, cars, machinery"
)

workflow = {
    "3": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 20261027,
            "steps": 28,
            "cfg": 6.5,
            "sampler_name": "dpmpp_2m",
            "scheduler": "karras",
            "denoise": 1.0,
            "model": ["4", 0],
            "positive": ["6", 0],
            "negative": ["7", 0],
            "latent_image": ["5", 0],
        },
    },
    "4": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {"ckpt_name": "juggernaut-xl-v9.safetensors"},
    },
    "5": {
        "class_type": "EmptyLatentImage",
        "inputs": {"width": 1024, "height": 1024, "batch_size": 1},
    },
    "6": {
        "class_type": "CLIPTextEncode",
        "inputs": {"text": positive, "clip": ["4", 1]},
    },
    "7": {
        "class_type": "CLIPTextEncode",
        "inputs": {"text": negative, "clip": ["4", 1]},
    },
    "8": {
        "class_type": "VAEDecode",
        "inputs": {"samples": ["3", 0], "vae": ["10", 0]},
    },
    "9": {
        "class_type": "SaveImage",
        "inputs": {"filename_prefix": "oju/iso-cutaway", "images": ["8", 0]},
    },
    "10": {
        "class_type": "VAELoader",
        "inputs": {"vae_name": "sdxl_vae.safetensors"},
    },
}

print("submitting...", flush=True)
r = requests.post(f"{BASE}/prompt", json={"prompt": workflow, "client_id": "oju-test"}, timeout=30)
r.raise_for_status()
prompt_id = r.json()["prompt_id"]
print("prompt_id", prompt_id, flush=True)

deadline = time.time() + 300
last = None
while time.time() < deadline:
    history = requests.get(f"{BASE}/history/{prompt_id}", timeout=30).json()
    if prompt_id in history:
        entry = history[prompt_id]
        outputs = entry.get("outputs", {})
        print(json.dumps(outputs, ensure_ascii=False, indent=2), flush=True)
        images = outputs.get("9", {}).get("images", [])
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

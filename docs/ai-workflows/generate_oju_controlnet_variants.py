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
    "perforated drainage pipe with visible holes in a gravel trench, catch basin, "
    "small puddle at a low point, concrete curb, tree roots, "
    "realistic soil, gravel, asphalt aggregate, wet concrete, "
    "detailed concrete building facade, "
    "no text, no labels, no numbers, no markers, "
    "overcast daylight, soft shadows, high detail, clean composition, "
    "editorial architectural visualization"
)
negative = (
    "text, letters, numbers, markers, labels, watermark, logo, "
    "distorted geometry, impossible layers, extra pipes, floating objects, "
    "cartoon, low quality, blurry, oversaturated, people, cars, machinery"
)

seeds = [20261031, 20261032, 20261033]

for seed in seeds:
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
        "4": {"class_type": "CLIPTextEncode", "inputs": {"text": positive, "clip": ["3", 1]}},
        "5": {"class_type": "CLIPTextEncode", "inputs": {"text": negative, "clip": ["3", 1]}},
        "6": {
            "class_type": "Canny",
            "inputs": {"image": ["2", 0], "low_threshold": 0.1, "high_threshold": 0.3},
        },
        "7": {
            "class_type": "ControlNetLoader",
            "inputs": {"control_net_name": "controlnet-union-sdxl-1.0.safetensors"},
        },
        "8": {
            "class_type": "SetUnionControlNetType",
            "inputs": {
                "control_net": ["7", 0],
                "type": "canny/lineart/anime_lineart/mlsd",
            },
        },
        "9": {
            "class_type": "ControlNetApplyAdvanced",
            "inputs": {
                "positive": ["4", 0],
                "negative": ["5", 0],
                "control_net": ["8", 0],
                "image": ["6", 0],
                "strength": 0.9,
                "start_percent": 0.0,
                "end_percent": 1.0,
                "vae": ["12", 0],
            },
        },
        "10": {"class_type": "VAEEncode", "inputs": {"pixels": ["2", 0], "vae": ["12", 0]}},
        "11": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": 32,
                "cfg": 6.0,
                "sampler_name": "dpmpp_2m",
                "scheduler": "karras",
                "denoise": 0.82,
                "model": ["3", 0],
                "positive": ["9", 0],
                "negative": ["9", 1],
                "latent_image": ["10", 0],
            },
        },
        "12": {"class_type": "VAELoader", "inputs": {"vae_name": "sdxl_vae.safetensors"}},
        "13": {"class_type": "VAEDecode", "inputs": {"samples": ["11", 0], "vae": ["12", 0]}},
        "14": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": f"oju/section-cn-{seed}",
                "images": ["13", 0],
            },
        },
    }

    print(f"submitting seed {seed}...", flush=True)
    r = requests.post(f"{BASE}/prompt", json={"prompt": workflow, "client_id": "oju-test"}, timeout=30)
    r.raise_for_status()
    prompt_id = r.json()["prompt_id"]
    deadline = time.time() + 300
    while time.time() < deadline:
        history = requests.get(f"{BASE}/history/{prompt_id}", timeout=30).json()
        if prompt_id in history:
            outputs = history[prompt_id].get("outputs", {})
            images = outputs.get("14", {}).get("images", [])
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
        raise SystemExit(f"timed out on seed {seed}")

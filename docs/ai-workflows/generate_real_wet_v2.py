import os
import shutil
import time
import requests

BASE = "http://127.0.0.1:8188"
OUT_DIR = "/home/ksi/Desktop/SI-Projects/OJU-EC/docs/images/ai-test"
os.makedirs(OUT_DIR, exist_ok=True)

positive = (
    "same apartment parking lot with drainage failure, "
    "same buildings, same camera angle, same composition, "
    "one very large mirror-like puddle covering the middle of the lot, clearly reflecting the buildings and sky, "
    "cracked asphalt with weeds in the joints, faded worn parking lines, "
    "damp stained concrete curb, "
    "overcast daylight, realistic, documentary photography, "
    "no text, no watermark, no people, no cars"
)
negative = (
    "text, letters, numbers, watermark, logo, "
    "dry clean pavement, new asphalt, "
    "different buildings, different angle, different composition, "
    "cartoon, low quality, blurry, oversaturated, people, cars"
)

workflow = {
    "1": {"class_type": "LoadImage", "inputs": {"image": "real-dry-base.png"}},
    "2": {
        "class_type": "ImageScale",
        "inputs": {
            "image": ["1", 0],
            "upscale_method": "lanczos",
            "width": 1344,
            "height": 896,
            "crop": "disabled",
        },
    },
    "3": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {"ckpt_name": "RealVisXL_V5.0_fp16.safetensors"},
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
            "strength": 0.65,
            "start_percent": 0.0,
            "end_percent": 1.0,
            "vae": ["12", 0],
        },
    },
    "10": {"class_type": "VAEEncode", "inputs": {"pixels": ["2", 0], "vae": ["12", 0]}},
    "11": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 20261107,
            "steps": 34,
            "cfg": 6.0,
            "sampler_name": "dpmpp_2m",
            "scheduler": "karras",
            "denoise": 0.78,
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
            "filename_prefix": "oju/real-wet-v2",
            "images": ["13", 0],
        },
    },
}

print("submitting same-place before...", flush=True)
r = requests.post(f"{BASE}/prompt", json={"prompt": workflow, "client_id": "oju-test"}, timeout=30)
r.raise_for_status()
prompt_id = r.json()["prompt_id"]
print("prompt_id", prompt_id, flush=True)
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
    raise SystemExit("timed out")

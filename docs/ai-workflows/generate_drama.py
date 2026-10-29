import os
import shutil
import time
import requests

BASE = "http://127.0.0.1:8188"
OUT_DIR = "/home/ksi/Desktop/SI-Projects/OJU-EC/docs/images/ai-test"
os.makedirs(OUT_DIR, exist_ok=True)
CKPT = "RealVisXL_V5.0_fp16.safetensors"

BASE_NEG = (
    "text, letters, numbers, watermark, logo, signature, people, cars, "
    "render, 3d render, illustration, painting, drawing, diagram, CGI, video game, anime, "
    "perfect symmetry, oversaturated, HDR, glowing, blurry, low quality"
)

jobs = [
    {
        "name": "drama-flood",
        "seed": 20261190,
        "prompt": (
            "dramatic smartphone photo of a flooded Korean apartment parking lot after heavy rain, "
            "ankle-deep murky water submerging the yellow parking lines, "
            "rain ripples and apartment towers reflected in the water, "
            "a half-submerged traffic cone, overcast storm sky, "
            "unedited amateur photo, natural grain"
        ),
    },
    {
        "name": "drama-heave",
        "seed": 20261191,
        "prompt": (
            "dramatic low-angle smartphone photo of severely heaved concrete sidewalk blocks, "
            "one row thrust upward forming a tall trip step with a deep dark gap, "
            "an orange traffic cone with white stripe standing beside it, "
            "weeds and sand in the joints, apartment wall blurred behind, "
            "overcast daylight, unedited amateur photo, natural grain"
        ),
    },
    {
        "name": "drama-grate",
        "seed": 20261192,
        "prompt": (
            "dramatic close smartphone photo of a metal drainage grate overflowing during rain, "
            "brown water gushing up and spreading across the asphalt, "
            "wet leaves plastered over half the bars, foam and muddy swirls, "
            "gray sidewalk blocks at the edge, overcast daylight, unedited amateur photo, natural grain"
        ),
    },
    {
        "name": "drama-drip",
        "seed": 20261193,
        "prompt": (
            "dramatic smartphone photo inside a dark Korean apartment underground parking garage, "
            "a concrete ceiling with a huge black water stain, a visible stream of water drops falling, "
            "wet reflective floor below, single flickering fluorescent tube, "
            "yellow-black hazard column base, moody low light, unedited amateur photo, natural grain"
        ),
    },
]

for job in jobs:
    workflow = {
        "3": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": CKPT}},
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": 1024, "height": 768, "batch_size": 1},
        },
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": job["prompt"], "clip": ["3", 1]}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": BASE_NEG, "clip": ["3", 1]}},
        "8": {"class_type": "VAELoader", "inputs": {"vae_name": "sdxl_vae.safetensors"}},
        "9": {
            "class_type": "KSampler",
            "inputs": {
                "seed": job["seed"],
                "steps": 30,
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
                src = os.path.join("/home/ksi/ComfyUI/output", image.get("subfolder", ""), image["filename"])
                dst = os.path.join(OUT_DIR, image["filename"])
                shutil.copy2(src, dst)
                print("saved", dst, flush=True)
            if images:
                break
        time.sleep(2)
    else:
        raise SystemExit(f"timed out on {job['name']}")

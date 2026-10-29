import os
import shutil
import time
import requests

BASE = "http://127.0.0.1:8188"
OUT_DIR = "/home/ksi/Desktop/SI-Projects/OJU-EC/docs/images/ai-test"
os.makedirs(OUT_DIR, exist_ok=True)
CKPT = "RealVisXL_V5.0_fp16.safetensors"

BASE_NEG = (
    "text, letters, numbers, watermark, logo, signature, people, machinery, excavator, toilet, "
    "render, 3d render, illustration, painting, drawing, diagram, CGI, video game, anime, "
    "perfect symmetry, oversaturated, HDR, glowing, blurry, low quality"
)

jobs = [
    {
        "name": "pipe-bed",
        "seeds": [20261195, 20261196],
        "prompt": (
            "smartphone photo looking along a clean gravel drainage trench, "
            "a brand-new gray perforated plastic drainage pipe with visible holes laid straight on level gravel, "
            "white geotextile fabric lining the trench walls, compacted brown soil walls, "
            "fresh asphalt edge and concrete curb at the top, "
            "overcast daylight, unedited amateur construction photo, natural grain"
        ),
    },
]

for job in jobs:
    for seed in job["seeds"]:
        workflow = {
            "3": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": CKPT}},
            "5": {
                "class_type": "EmptyLatentImage",
                "inputs": {"width": 1344, "height": 896, "batch_size": 1},
            },
            "6": {"class_type": "CLIPTextEncode", "inputs": {"text": job["prompt"], "clip": ["3", 1]}},
            "7": {"class_type": "CLIPTextEncode", "inputs": {"text": BASE_NEG, "clip": ["3", 1]}},
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
                "inputs": {"filename_prefix": f"oju/{job['name']}-{seed}", "images": ["10", 0]},
            },
        }

        print(f"submitting {job['name']} seed {seed}...", flush=True)
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

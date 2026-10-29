"""Download and verify only pinned Apache-2.0 Qwen editing weights.

Writes solely under this isolated temporary directory; no shared models or
Python environments are changed. The files are data, not executable code.
"""
from pathlib import Path
import hashlib
import os
import subprocess

ROOT = Path(__file__).resolve().parent
FILES = [
    ("Comfy-Org/Qwen-Image-Edit", "f68ace85e60b4a02a323e394253731947657b7d2",
     "split_files/diffusion_models/qwen_image_edit_2511_fp8mixed.safetensors",
     20533762817, "c9fdc158e46d3b61ef75f21ae866ca2fe808bf4a53643120d1c1e87c19280a4e"),
    ("Comfy-Org/Qwen-Image", "1f12b17be14c89b026c51a91d67c32f84bb047bc",
     "split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors",
     9384670680, "cb5636d852a0ea6a9075ab1bef496c0db7aef13c02350571e388aea959c5c0b4"),
    ("Comfy-Org/Qwen-Image", "1f12b17be14c89b026c51a91d67c32f84bb047bc",
     "split_files/vae/qwen_image_vae.safetensors",
     253806246, "a70580f0213e67967ee9c95f05bb400e8fb08307e017a924bf3441223e023d1f"),
]

for repo, rev, remote_path, size_expected, sha_expected in FILES:
    local_path = remote_path.removeprefix("split_files/")
    target = ROOT / "models" / local_path
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() or target.is_symlink():
        raise RuntimeError(f"Refusing to overwrite {target}")
    partial = target.with_suffix(target.suffix + ".part")
    url = f"https://huggingface.co/{repo}/resolve/{rev}/{remote_path}?download=true"
    print(f"Downloading {repo}/{remote_path}, expected {size_expected} bytes", flush=True)
    subprocess.run([
        "nice", "-n", "15", "ionice", "-c", "3", "curl", "--fail", "--location", "--retry", "3",
        "--retry-delay", "5", "--continue-at", "-", "--limit-rate", "40M", "--silent", "--show-error",
        "--output", str(partial), url,
    ], check=True)
    digest = hashlib.sha256()
    with partial.open("rb") as f:
        for data in iter(lambda: f.read(8 * 1024 * 1024), b""):
            digest.update(data)
    actual, size = digest.hexdigest(), partial.stat().st_size
    if actual != sha_expected or size != size_expected:
        raise RuntimeError(f"Mismatch {local_path}: {size} bytes SHA-256 {actual}")
    os.replace(partial, target)
    print(f"Verified {local_path} SHA-256 {actual}", flush=True)

print("All provider LFS hashes verified.", flush=True)

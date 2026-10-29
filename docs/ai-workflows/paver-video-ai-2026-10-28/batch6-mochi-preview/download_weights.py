"""Download only pinned Mochi weights into this isolated directory.

The provider's published LFS SHA-256 values are checked before a file can
be used. No shared model directory or Python environment is modified.
"""
from pathlib import Path
import hashlib
import os
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
REV = "ed4b8585dc4d3204397291c35e100884686178d6"
BASE = f"https://huggingface.co/Comfy-Org/Mochi-Preview/resolve/{REV}/split_files/"
FILES = [
    ("diffusion_models/mochi_preview_fp8_scaled.safetensors", 10028084160,
     "8a6475b5380c90461a40d5c08ad574a5ad5ac4e6047e5f5f3f294df363f50705"),
    ("text_encoders/t5xxl_fp8_e4m3fn_scaled.safetensors", 5157348688,
     "a498f0485dc9536735258018417c3fd7758dc3bccc0a645feaa472b34955557a"),
    ("vae/mochi_vae.safetensors", 919544702,
     "1be451cec94b911980406169286babc5269e7cf6a94bbbbdf45e8d3f2c961083"),
]

for relative, expected_size, expected_sha in FILES:
    target = ROOT / "models" / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        raise RuntimeError(f"Refusing to overwrite {target}")
    partial = target.with_suffix(target.suffix + ".part")
    url = BASE + relative + "?download=true"
    print(f"Downloading {relative}, expected {expected_size} bytes", flush=True)
    subprocess.run([
        "nice", "-n", "15", "ionice", "-c", "3", "curl", "--fail",
        "--location", "--retry", "3", "--retry-delay", "5", "--continue-at", "-",
        "--limit-rate", "30M", "--silent", "--show-error", "--output", str(partial), url,
    ], check=True)
    size = partial.stat().st_size
    digest = hashlib.sha256()
    with partial.open("rb") as stream:
        for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            digest.update(chunk)
    actual_sha = digest.hexdigest()
    if size != expected_size or actual_sha != expected_sha:
        raise RuntimeError(f"Mismatch {relative}: {size} bytes SHA-256 {actual_sha}")
    os.replace(partial, target)
    print(f"Verified {relative} SHA-256 {actual_sha}", flush=True)

print("All three provider LFS hashes verified.", flush=True)

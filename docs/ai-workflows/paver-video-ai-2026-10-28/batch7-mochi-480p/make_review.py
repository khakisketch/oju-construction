"""Encode actual generated PNGs and produce frame sheets in the temp area.

These are evaluation assets, not approved scroll frames or field footage.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
DEST = ROOT / "review"
DEST.mkdir(exist_ok=True)


def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def grid(paths, indices, columns, width, height, output):
    rows = (len(indices) + columns - 1) // columns
    label_height = 17
    sheet = Image.new("RGB", (columns * width, rows * (height + label_height)), "#172435")
    draw = ImageDraw.Draw(sheet)
    for cell, frame in enumerate(indices):
        x, y = (cell % columns) * width, (cell // columns) * (height + label_height)
        draw.text((x + 4, y + 1), f"frame {frame + 1:02d} / {len(paths)}", fill="white")
        with Image.open(paths[frame]) as source:
            image = source.convert("RGB")
            image.thumbnail((width, height), Image.Resampling.LANCZOS)
            # Do not distort the 848×480 follow-up by forcing the 640×384
            # pilot aspect ratio; center with a small letterbox instead.
            sheet.paste(image, (x + (width - image.width) // 2,
                                y + label_height + (height - image.height) // 2))
    sheet.save(output, quality=91, subsampling=0)


for index in map(int, sys.argv[1:]):
    # Mochi 32–34: 49 frames at 24 fps. Wan first/last probes 35–36:
    # 33 frames at 16 fps. Synthetic fixture 99 follows the Mochi format.
    count, node, fps = (33, "14", 16) if index in (35, 36) else (49, "28", 24)
    history = json.loads((ROOT / f"candidate-{index}-history.json").read_text())
    frames = history["outputs"][node]["images"]
    if len(frames) != count or history["status"]["status_str"] != "success":
        raise RuntimeError(f"Candidate {index} did not produce {count} frames successfully")
    paths = []
    for frame in frames:
        path = (ROOT / "output" / frame["subfolder"] / frame["filename"]).resolve(strict=True)
        if not path.is_relative_to((ROOT / "output").resolve()) or not path.name.startswith(f"candidate-{index}_"):
            raise RuntimeError(f"Unexpected frame location: {path}")
        paths.append(path)
    if len(set(paths)) != count:
        raise RuntimeError("Duplicate frames in Comfy history")
    out = DEST / f"candidate-{index}.mp4"
    if out.exists():
        raise RuntimeError(f"Refusing to overwrite {out}")
    # list file follows server history order rather than trusting filename sorting.
    filelist = DEST / f"candidate-{index}-frames.txt"
    with filelist.open("x", encoding="utf-8") as f:
        for path in paths:
            f.write("file '" + str(path).replace("'", "'\\''") + "'\n")
    subprocess.run([
        "nice", "-n", "15", "ionice", "-c", "3", "ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error", "-n",
        "-r", str(fps), "-f", "concat", "-safe", "0", "-i", str(filelist), "-r", str(fps), "-c:v", "libx264",
        "-crf", "19", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out),
    ], check=True)
    probe = json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,nb_frames,avg_frame_rate",
        "-show_entries", "format=duration", "-of", "json", str(out),
    ]))
    streams = probe["streams"]
    expected_width, expected_height = (848, 480) if index in (37, 38) else (640, 384)
    if (len(streams) != 1 or streams[0]["codec_type"] != "video" or int(streams[0]["nb_frames"]) != count
            or (streams[0]["width"], streams[0]["height"]) != (expected_width, expected_height)):
        raise RuntimeError(f"Unexpected encoded output: {probe}")
    nine = [round(i * (len(paths) - 1) / 8) for i in range(9)]
    for name in (f"sheet-{index}.jpg", f"motion-grid-{index}.jpg"):
        if (DEST / name).exists():
            raise RuntimeError(f"Refusing to overwrite {name}")
    grid(paths, nine, 3, 320, 192, DEST / f"sheet-{index}.jpg")
    grid(paths, list(range(count)), 7, 192, 115, DEST / f"motion-grid-{index}.jpg")
    outputs = [out, DEST / f"sheet-{index}.jpg", DEST / f"motion-grid-{index}.jpg"]
    print(json.dumps({"candidate": index, "probe": probe,
                      "outputs": [{"path": str(p), "bytes": p.stat().st_size, "sha256": sha256(p)} for p in outputs]}), flush=True)

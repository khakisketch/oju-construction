"""Make labeled before/after contact sheets for internal condition review.

These images are exploratory input conditions, not final marketing visuals,
not validated pavement geometry and not evidence of a physical process.
"""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageStat
import json
import sys

ROOT = Path(__file__).resolve().parent
REVIEW = ROOT / "review"
REVIEW.mkdir(exist_ok=True)


def history_file(case, node):
    history = json.loads((ROOT / f"edit-{case}-history.json").read_text())
    if history["status"]["status_str"] != "success":
        raise RuntimeError(f"Edit {case} did not succeed")
    items = history["outputs"][node]["images"]
    if len(items) != 1:
        raise RuntimeError(f"Edit {case} node {node} has {len(items)} outputs")
    item = items[0]
    path = (ROOT / "output" / item["subfolder"] / item["filename"]).resolve(strict=True)
    if not path.is_relative_to((ROOT / "output").resolve()):
        raise RuntimeError(f"Unexpected output path: {path}")
    return path


def mean_difference(image):
    return sum(ImageStat.Stat(image).mean) / 3


def stats(before, after, roi):
    diff = ImageChops.difference(before, after)
    w, h = before.size
    x0, y0, x1, y1 = roi
    outside_regions = [(0, 0, w, y0), (0, y1, w, h), (0, y0, x0, y1), (x1, y0, w, y1)]
    accum = 0
    count = 0
    for box in outside_regions:
        area = (box[2] - box[0]) * (box[3] - box[1])
        accum += mean_difference(diff.crop(box)) * area
        count += area
    return {"mean_abs_rgb_0_to_255": round(mean_difference(diff), 2),
            "center_mean_abs_rgb_0_to_255": round(mean_difference(diff.crop(roi)), 2),
            "outside_mean_abs_rgb_0_to_255": round(accum / count, 2),
            "roi": list(roi),
            "warning": "Pixel differences include re-rendering and lighting, not proof of block movement or physical correctness."}


def resized(image, box):
    result = image.copy()
    result.thumbnail(box, Image.Resampling.LANCZOS)
    return result


def draw_pair(before, after, roi, out):
    w, h = before.size
    maxsize = (620, 400)
    top_a, top_b = resized(before, maxsize), resized(after, maxsize)
    crop_a, crop_b = resized(before.crop(roi), (620, 400)), resized(after.crop(roi), (620, 400))
    col = 620
    top_h, crop_h = max(top_a.height, top_b.height), max(crop_a.height, crop_b.height)
    label = 24
    canvas = Image.new("RGB", (col * 2, top_h + crop_h + 2 * label), "#172435")
    d = ImageDraw.Draw(canvas)
    d.text((6, 5), "SCALED INPUT - AI EXAMPLE", fill="white")
    d.text((col + 6, 5), "EDITED OUTPUT - NOT APPROVED", fill="white")
    canvas.paste(top_a, ((col - top_a.width) // 2, label))
    canvas.paste(top_b, (col + (col - top_b.width) // 2, label))
    y = label + top_h
    d.text((6, y + 5), "INPUT CENTER - ENLARGED", fill="white")
    d.text((col + 6, y + 5), "OUTPUT SAME AREA - ENLARGED", fill="white")
    canvas.paste(crop_a, ((col - crop_a.width) // 2, y + label))
    canvas.paste(crop_b, (col + (col - crop_b.width) // 2, y + label))
    canvas.save(out, quality=90, subsampling=0)


for case in sys.argv[1:]:
    if case not in "ABCD" or len(case) != 1:
        raise ValueError(case)
    source, edited = history_file(case, "16"), history_file(case, "15")
    with Image.open(source) as im:
        before = im.convert("RGB")
    with Image.open(edited) as im:
        after = im.convert("RGB")
    if before.size != after.size:
        raise RuntimeError(f"The exact scaled input and output sizes differ: {before.size} {after.size}")
    w, h = before.size
    roi = (round(w * .30), round(h * .27), round(w * .75), round(h * .74))
    output = REVIEW / f"compare-{case}.jpg"
    metrics = REVIEW / f"compare-{case}.json"
    if output.exists() or metrics.exists():
        raise RuntimeError(f"Refusing to overwrite {case} review")
    draw_pair(before, after, roi, output)
    result = {"case": case, "input": str(source), "edited": str(edited), "size": [w, h], **stats(before, after, roi)}
    with metrics.open("x", encoding="utf-8") as f:
        f.write(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result), flush=True)

"""Validate current built-in node schemas without loading any model weights."""
from pathlib import Path
import importlib.util
import json
import os
import socket
import subprocess
import tempfile
import time
import urllib.error

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("edits", HERE / "run_edits.py")
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
safe = runner.SAFE

initial = safe.compute_processes()
foreign = [(pid, name) for pid, name in initial if not name.endswith("gnome-remote-desktop-daemon")]
if foreign or safe.available_mib() < 85 * 1024:
    raise RuntimeError(f"Shared GPU or memory preflight blocked: compute={foreign}")
baseline = {pid for pid, _ in initial}
root = Path(tempfile.mkdtemp(prefix="node-preflight-", dir=HERE))
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as reservation:
    reservation.bind(("127.0.0.1", 0))
    port = reservation.getsockname()[1]
base = f"http://127.0.0.1:{port}"
args = ["/home/ksi/ComfyUI/.venv/bin/python", "/home/ksi/ComfyUI/main.py", "--listen", "127.0.0.1",
        "--port", str(port), "--base-directory", str(root), "--disable-auto-launch", "--offline",
        "--disable-all-custom-nodes", "--disable-assets", "--vram-headroom", "24"]
env = os.environ.copy()
env.update({"OMP_NUM_THREADS": "2", "OPENBLAS_NUM_THREADS": "2", "MKL_NUM_THREADS": "2",
            "COMFYUI_DISABLE_PRODUCT_TIPS": "1"})
with (root / "server.log").open("x") as log:
    proc = subprocess.Popen(args, cwd="/home/ksi/ComfyUI", env=env, stdout=log, stderr=subprocess.STDOUT)
    try:
        deadline = time.monotonic() + 120
        while True:
            if proc.poll() is not None or time.monotonic() > deadline:
                raise RuntimeError("Local node preflight server failed to start")
            safe.safety_check(proc.pid, baseline)
            try:
                safe.get_json(base + "/system_stats", timeout=2)
                listing = subprocess.run(["ss", "-H", "-lntp", "sport", "=", f":{port}"],
                                         text=True, capture_output=True, check=True, timeout=5).stdout
                if f"pid={proc.pid}," not in listing:
                    raise RuntimeError(f"Unexpected port owner: {listing}")
                break
            except (urllib.error.URLError, TimeoutError):
                time.sleep(2)
        infos = {}
        for case in "ABCD":
            for node in runner.graph(case)["prompt"].values():
                kind = node["class_type"]
                if kind not in infos:
                    response = safe.get_json(base + "/object_info/" + kind)
                    if kind not in response:
                        raise RuntimeError(f"Missing native node {kind}")
                    infos[kind] = response[kind]
                schema = infos[kind]["input"]
                allowed = set(schema.get("required", {})) | set(schema.get("optional", {}))
                required = set(schema.get("required", {}))
                given = set(node["inputs"])
                if required - given or given - allowed:
                    raise RuntimeError(f"Invalid {kind} inputs: missing={required-given}, extra={given-allowed}")
        types = infos["CLIPLoader"]["input"]["required"]["type"][0]
        if "qwen_image" not in types:
            raise RuntimeError("Native CLIPLoader does not support qwen_image")
        print(json.dumps({"native_nodes_validated": sorted(infos), "graphs": list("ABCD"),
                          "qwen_image_clip_supported": True, "server_pid": proc.pid, "port": port}))
    finally:
        if proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(timeout=20)
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait(timeout=10)
        print(f"Owned node-preflight server stopped, exit={proc.returncode}")

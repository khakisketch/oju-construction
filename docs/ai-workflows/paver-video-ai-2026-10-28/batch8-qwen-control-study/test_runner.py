"""Offline tests only: do not load models, start servers or generate images."""
from pathlib import Path
from unittest.mock import patch
import hashlib
import importlib.util
import tempfile
import unittest

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("edit_runner", HERE / "run_edits.py")
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


class RunnerTests(unittest.TestCase):
    def test_graphs_use_native_offline_inputs_and_model(self):
        for case in "ABCD":
            g = runner.graph(case)["prompt"]
            self.assertEqual(g["1"]["class_type"], "UNETLoader")
            self.assertEqual(g["4"]["inputs"]["type"], "qwen_image")
            self.assertEqual(g["8"]["class_type"], "TextEncodeQwenImageEditPlus")
            self.assertEqual(g["13"]["inputs"]["steps"], 40)
            self.assertEqual(g["13"]["inputs"]["cfg"], 4.0)
            self.assertEqual(g["15"]["inputs"]["filename_prefix"], "edit-" + case)
            self.assertFalse(any("http:" in str(node) or "https:" in str(node) for node in g.values()))
            self.assertEqual("image2" in g["8"]["inputs"], case == "B")
            self.assertEqual("image2" in g["9"]["inputs"], case == "B")

    def test_expected_hash_allows_only_verified_fixture(self):
        with tempfile.TemporaryDirectory(prefix="qwen-hash-test-", dir=HERE) as dirname:
            root = Path(dirname)
            path = root / "models/test.safetensors"
            path.parent.mkdir(parents=True)
            data = b"synthetic fixture not model weights"
            path.write_bytes(data)
            expected = hashlib.sha256(data).hexdigest()
            with patch.object(runner, "ROOT", root), patch.object(runner, "WEIGHTS", [("models/test.safetensors", len(data), expected)]):
                runner.verify_models()
            self.assertTrue((root / "verified-models.json").is_file())

    def test_bad_hash_never_creates_verified_marker(self):
        with tempfile.TemporaryDirectory(prefix="qwen-hash-test-", dir=HERE) as dirname:
            root = Path(dirname)
            path = root / "models/test.safetensors"
            path.parent.mkdir(parents=True)
            data = b"synthetic fixture not model weights"
            path.write_bytes(data)
            with patch.object(runner, "ROOT", root), patch.object(runner, "WEIGHTS", [("models/test.safetensors", len(data), "0" * 64)]):
                with self.assertRaisesRegex(RuntimeError, "hash mismatch"):
                    runner.verify_models()
            self.assertFalse((root / "verified-models.json").exists())

    def test_safety_rejects_new_compute_and_low_memory(self):
        with patch.object(runner.SAFE, "available_mib", return_value=100000), patch.object(
            runner.SAFE, "compute_processes", return_value=[(100, "display"), (222, "our server"), (333, "other")]
        ):
            with self.assertRaisesRegex(RuntimeError, "another GPU compute"):
                runner.SAFE.safety_check(222, {100})
        with patch.object(runner.SAFE, "available_mib", return_value=runner.SAFE.MIN_DURING_MIB - 1):
            with self.assertRaisesRegex(RuntimeError, "shared-memory safety"):
                runner.SAFE.safety_check(222, set())


if __name__ == "__main__":
    unittest.main(verbosity=2)

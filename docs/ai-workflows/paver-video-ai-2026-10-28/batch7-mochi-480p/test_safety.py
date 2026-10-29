"""Offline tests for the isolated runner's resource checks and API graphs."""
from unittest.mock import patch
import importlib.util
from pathlib import Path
import unittest

path = Path(__file__).resolve().parent / "run_mochi.py"
spec = importlib.util.spec_from_file_location("run_mochi", path)
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


class SafetyTest(unittest.TestCase):
    def test_current_server_and_existing_display_are_allowed(self):
        with patch.object(runner, "available_mib", return_value=100000), patch.object(
            runner, "compute_processes", return_value=[(100, "display"), (222, "our server")]
        ):
            self.assertEqual(runner.safety_check(222, {100}), 100000)

    def test_new_foreign_gpu_compute_stops_generation(self):
        with patch.object(runner, "available_mib", return_value=100000), patch.object(
            runner, "compute_processes", return_value=[(100, "display"), (222, "our server"), (333, "other")]
        ):
            with self.assertRaisesRegex(RuntimeError, "another GPU compute"):
                runner.safety_check(222, {100})

    def test_low_shared_memory_stops_generation(self):
        with patch.object(runner, "available_mib", return_value=runner.MIN_DURING_MIB - 1), patch.object(
            runner, "compute_processes", return_value=[]
        ):
            with self.assertRaisesRegex(RuntimeError, "shared-memory safety"):
                runner.safety_check(222, set())

    def test_graphs_are_real_native_text_to_video(self):
        for index in (32, 33, 34):
            prompt = runner.make_graph(index)["prompt"]
            self.assertEqual(prompt["21"]["class_type"], "EmptyMochiLatentVideo")
            self.assertEqual(prompt["21"]["inputs"]["length"], 49)
            self.assertEqual(prompt["3"]["inputs"]["steps"], 30)
            self.assertEqual(prompt["3"]["inputs"]["seed"], 2026102900 + index)
            self.assertEqual(prompt["38"]["inputs"]["type"], "mochi")
            self.assertEqual(prompt["28"]["class_type"], "SaveImage")
            self.assertFalse(any(x["class_type"] in ("LoadImage", "LoadVideo") for x in prompt.values()))

    def test_followups_use_larger_recommended_resolution(self):
        for index in (37, 38):
            prompt = runner.make_graph(index)["prompt"]
            self.assertEqual((prompt["21"]["inputs"]["width"], prompt["21"]["inputs"]["height"]), (848, 480))
            self.assertEqual(prompt["21"]["inputs"]["length"], 49)
            self.assertEqual(prompt["3"]["inputs"]["seed"], 2026102900 + index)


if __name__ == "__main__":
    unittest.main(verbosity=2)

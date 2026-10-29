// SamePlaceComparison scroll-handoff regression coverage. The divider math below
// is SIMULATED (pure-function level); it locks the continuity protocol the
// component implements: interrupting the one-time demo must continue from the
// live value (<=12pt per 45px wheel at 1440x900), never snap to the absolute
// mapping. Run: node --test src/features/renewal-b/SamePlaceComparison.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const dir = path.dirname(fileURLToPath(import.meta.url));
const nodeModules = path.resolve(dir, "../../../node_modules");
const toFileUrl = (p) => pathToFileURL(p).href;
const jsxRuntimeUrl = toFileUrl(path.join(nodeModules, "react", "jsx-runtime.js"));
const reactUrl = toFileUrl(path.join(nodeModules, "react", "index.js"));
const reactSource = JSON.stringify(reactUrl);

function transpileComponent() {
  const source = readFileSync(path.join(dir, "SamePlaceComparison.tsx"), "utf8");
  let js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const framerStub =
    `data:text/javascript,` +
    encodeURIComponent(
      `export const animate=()=>({stop(){}});` +
        `export const useMotionValue=(v)=>({get:()=>v,set(){}});` +
        `export const useReducedMotion=()=>false;`,
    );
  const sliderStub =
    `data:text/javascript,` +
    encodeURIComponent(`export default function BeforeAfterSlider(){return null;}`);
  const cssStub =
    `data:text/javascript,` + encodeURIComponent(`export default {};`);
  js = js
    .split('"react/jsx-runtime"')
    .join(JSON.stringify(jsxRuntimeUrl))
    .split('"react"')
    .join(reactSource)
    .split('"framer-motion"')
    .join(JSON.stringify(framerStub))
    .split('"../home/portfolio/BeforeAfterSlider"')
    .join(JSON.stringify(sliderStub))
    .split('"./RenewalBDesign.module.css"')
    .join(JSON.stringify(cssStub));
  return js;
}

const {
  COMPARISON_SCROLL_TOP,
  COMPARISON_SCROLL_BOTTOM,
  clampComparisonPercent,
  comparisonBaseForProgress,
  comparisonProgressForScroll,
  comparisonValueForScroll,
  comparisonOffsetForHandoff,
  comparisonDeltaForScrollStep,
} = await import(
  `data:text/javascript,${encodeURIComponent(transpileComponent())}`
);

// 1440x900 geometry: sticky spacer clamp(10rem, 30svh, 22rem) = 270px travel.
const DISTANCE_1440x900 = 270;
const START = 1442;

describe("comparison scroll mapping", () => {
  it("full sticky travel sweeps exactly 75 -> 25 with zero offset", () => {
    assert.equal(comparisonValueForScroll(START, START, DISTANCE_1440x900, 0), 75);
    const end = START + DISTANCE_1440x900;
    assert.equal(comparisonValueForScroll(end, START, DISTANCE_1440x900, 0), 25);
    assert.equal(
      comparisonValueForScroll(START - 5000, START, DISTANCE_1440x900, 0),
      75,
    );
    assert.equal(
      comparisonValueForScroll(end + 5000, START, DISTANCE_1440x900, 0),
      25,
    );
  });

  it("45px wheel moves at most 12 points at 1440x900", () => {
    assert.ok(comparisonDeltaForScrollStep(45, DISTANCE_1440x900) <= 12);
    assert.equal(
      comparisonDeltaForScrollStep(45, DISTANCE_1440x900),
      (45 / 270) * 50,
    );
  });

  it("progress clamps outside the sticky travel (no overshoot source)", () => {
    assert.equal(comparisonProgressForScroll(START - 10, START, 270), 0);
    assert.equal(
      comparisonProgressForScroll(START + 10000, START, DISTANCE_1440x900),
      1,
    );
    assert.equal(comparisonBaseForProgress(-3), COMPARISON_SCROLL_TOP);
    assert.equal(comparisonBaseForProgress(99), COMPARISON_SCROLL_BOTTOM);
  });
});

describe("demo interruption handoff (red repro)", () => {
  // Red baseline: enter #before-after, demo falls to 53, wheel 45px snapped
  // the divider to ~70 (17 points). The handoff offset must keep the live
  // value instead.
  it("wheel 45px during the demo continues from the live value", () => {
    const liveValue = 53;
    const scrollAtInterrupt = START + 5;
    const scrollAfterWheel = scrollAtInterrupt + 45;

    // Direct scroll interrupt: rebase at the NEW position -> zero jump.
    const offsetNew = comparisonOffsetForHandoff(
      liveValue,
      scrollAfterWheel,
      START,
      DISTANCE_1440x900,
    );
    assert.equal(
      comparisonValueForScroll(
        scrollAfterWheel,
        START,
        DISTANCE_1440x900,
        offsetNew,
      ),
      liveValue,
    );

    // Wheel pre-interrupt (rebase at OLD position) then 45px scroll.
    const offsetOld = comparisonOffsetForHandoff(
      liveValue,
      scrollAtInterrupt,
      START,
      DISTANCE_1440x900,
    );
    const afterWheel = comparisonValueForScroll(
      scrollAfterWheel,
      START,
      DISTANCE_1440x900,
      offsetOld,
    );
    assert.ok(
      Math.abs(afterWheel - liveValue) <= 12,
      `expected <=12pt move, got ${liveValue} -> ${afterWheel}`,
    );
    assert.ok(
      Math.abs(afterWheel - 70) > 1,
      "must not snap back toward the absolute mapping (~70)",
    );
  });

  it("follow-up scrolls stay continuous from the handoff", () => {
    const liveValue = 53;
    const scrollAtInterrupt = START + 5;
    let offset = comparisonOffsetForHandoff(
      liveValue,
      scrollAtInterrupt,
      START,
      DISTANCE_1440x900,
    );
    let previous = comparisonValueForScroll(
      scrollAtInterrupt,
      START,
      DISTANCE_1440x900,
      offset,
    );
    assert.equal(previous, liveValue);
    for (let step = 1; step <= 6; step += 1) {
      const scrollY = scrollAtInterrupt + step * 45;
      const next = comparisonValueForScroll(
        scrollY,
        START,
        DISTANCE_1440x900,
        offset,
      );
      assert.ok(
        Math.abs(next - previous) <= 12,
        `step ${step}: ${previous} -> ${next} exceeds 12pt`,
      );
      previous = next;
    }
  });

  it("demo settle onto the mapping is imperceptible (<5pt near entry)", () => {
    // Natural demo end leaves the divider at 75; entry progress is < 0.1.
    const base = comparisonBaseForProgress(0.0999);
    assert.ok(Math.abs(COMPARISON_SCROLL_TOP - base) < 5);
  });
});

describe("manual input and re-entry protocol", () => {
  it("a manual value is applied verbatim and survives parked scroll", () => {
    // The component parks scroll updates while manualOverride is set; the
    // pure mapping only needs to represent explicit values exactly.
    assert.equal(clampComparisonPercent(30), 30);
    assert.equal(clampComparisonPercent(100), 100);
    assert.equal(clampComparisonPercent(-5), 0);
    assert.equal(clampComparisonPercent(140), 100);
  });

  it("exit resets the offset so re-entry restarts from the absolute mapping", () => {
    const offset = 0; // reset on observer exit
    assert.equal(
      comparisonValueForScroll(START, START, DISTANCE_1440x900, offset),
      75,
    );
  });
});

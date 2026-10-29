// Render the real component with synthetic cases. These are illustration and
// accessibility checks, not engineering verification of the diagrams.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");
const source = readFileSync(fileURLToPath(new URL("./DiagnosisConcept.tsx", import.meta.url)), "utf8");
let js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
js = js
  .replace('"react/jsx-runtime"', JSON.stringify(pathToFileURL(require.resolve("react/jsx-runtime")).href))
  .replace('"react"', JSON.stringify(pathToFileURL(require.resolve("react")).href))
  .replace('"./RenewalBDesign.module.css"', '"data:text/javascript,export default {}"');
const { default: DiagnosisConcept } = await import(`data:text/javascript,${encodeURIComponent(js)}`);

const cases = [
  ["water", "물이 고인 포장 표면과 배수구 주변"],
  ["pavers", "들뜬 보도블럭과 포장 하부"],
  ["drain", "이물질이 쌓인 배수구와 집수 공간"],
  ["leak", "천장의 누수 흔적과 그 위쪽 공간"],
];

describe("symptom inspection illustrations", () => {
  for (const [symptom, description] of cases) {
    it(`${symptom} labels its own example and both inspection points`, () => {
      const html = renderToStaticMarkup(React.createElement(DiagnosisConcept, { symptom }));
      assert.match(html, /role="img"/);
      assert.ok(html.includes(description));
      assert.ok(html.includes("실제 설계도가 아닙니다"));
      assert.equal((html.match(/>1<\/text>/g) ?? []).length, 1);
      assert.equal((html.match(/>2<\/text>/g) ?? []).length, 1);
    });
  }
});

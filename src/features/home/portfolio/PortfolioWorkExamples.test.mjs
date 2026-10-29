// PortfolioWorkExamples SSR 표현 테스트. 아래 내용은 SIMULATED 검증이며
// 실제 업체 실적·실제 백엔드 연동 검증이 아닙니다. 실행:
// node --test src/features/home/portfolio/PortfolioWorkExamples.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const dir = path.dirname(fileURLToPath(import.meta.url));
const nodeModules = path.resolve(dir, "../../../../node_modules");
const toFileUrl = (p) => pathToFileURL(p).href;
const jsxRuntimeUrl = toFileUrl(path.join(nodeModules, "react", "jsx-runtime.js"));
const reactUrl = toFileUrl(path.join(nodeModules, "react", "index.js"));
const serverUrl = toFileUrl(path.join(nodeModules, "react-dom", "server.node.js"));
const reactSource = JSON.stringify(reactUrl);

function transpile(filename, options) {
  const source = readFileSync(path.join(dir, filename), "utf8");
  return ts.transpileModule(source, { compilerOptions: options }).outputText;
}

const dataUrl = (js) => `data:text/javascript,${encodeURIComponent(js)}`;

const { PortfolioWorkExamples } = await (async () => {
  const mediaUrl = dataUrl(
    transpile("../problems/fieldWorkMedia.ts", {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    }),
  );
  const lucideStub = dataUrl(
    `import { jsx as _jsx } from ${JSON.stringify(jsxRuntimeUrl)};\n` +
      `const icon = (props) => _jsx("svg", { "aria-hidden": props["aria-hidden"], className: props.className });\n` +
      `export const ArrowRight = icon;\n` +
      `export const Play = icon;\n` +
      `export const RotateCcw = icon;`,
  );
  const videoUrl = dataUrl(
    transpile("../problems/FieldWorkVideo.tsx", {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    })
      .split('"react/jsx-runtime"')
      .join(JSON.stringify(jsxRuntimeUrl))
      .split('"react"')
      .join(reactSource)
      .split('"lucide-react"')
      .join(JSON.stringify(lucideStub))
      .split('"./fieldWorkMedia"')
      .join(JSON.stringify(mediaUrl)),
  );

  let galleryJs = transpile("PortfolioWorkExamples.tsx", {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX,
  });
  galleryJs = galleryJs
    .split('"react/jsx-runtime"')
    .join(JSON.stringify(jsxRuntimeUrl))
    .split('"react"')
    .join(reactSource)
    .split('"../problems/fieldWorkMedia"')
    .join(JSON.stringify(mediaUrl))
    .split('"../problems/FieldWorkVideo"')
    .join(JSON.stringify(videoUrl));
  return import(dataUrl(galleryJs));
})();

const React = (await import(reactUrl)).default;
const { renderToStaticMarkup } = await import(serverUrl);

const render = () =>
  renderToStaticMarkup(React.createElement(PortfolioWorkExamples));

describe("PortfolioWorkExamples presentation", () => {
  it("두 참고 영상을 로컬 소스로 보이고 실적 증빙으로 표기하지 않는다", () => {
    const html = render();
    assert.ok(html.includes("작업 영상 예시"));
    assert.ok(html.includes("/media/field-work/paving-preparation-demo.mp4"));
    assert.ok(html.includes("/media/field-work/civil-demo.mp4"));
    assert.ok(html.includes("포장면 정리 작업"));
    assert.ok(!html.includes("포장면 정리 작업 참고 영상"));
    assert.ok(html.includes("도로 보수 작업 참고 영상"));
    const notices = html.match(/실제 오주건설 현장이 아닙니다/g) || [];
    assert.ok(notices.length >= 2);
    assert.ok(!html.includes("관련 시공사례 보기"));
    assert.ok(!html.includes("시공실적 목록"));
    const videos = html.match(/<video[^>]*>/g) || [];
    assert.equal(videos.length, 2);
    for (const tag of videos) {
      assert.ok(tag.includes('preload="none"'));
      assert.ok(!tag.includes("controls"));
    }
  });

  it("출처 펼침과 재생 버튼이 영상마다 있다", () => {
    const html = render();
    assert.ok(html.includes("영상 출처"));
    assert.ok(html.includes("Pexels 라이선스"));
    const labels = html.match(/aria-label="[^"]*재생"/g) || [];
    assert.equal(labels.length, 2);
  });
});

// Uses locally installed Playwright 1.60 and the matching Firefox/WebKit builds.
const fs = require('node:fs');
const vm = require('node:vm');
const {firefox, webkit} = require('playwright-core');
const run = vm.runInThisContext(fs.readFileSync('docs/paver-hybrid-browser-regression-2026-10-28.js', 'utf8'));

(async () => {
  for (const [name, type] of [['firefox', firefox], ['webkit', webkit]]) {
    const browser = await type.launch({headless:true});
    try {
      const page = await browser.newPage();
      const result = await run(page);
      console.log(JSON.stringify({name, ...result}));
    } finally {
      await browser.close();
    }
  }
})().catch(error => {console.error(error); process.exitCode=1;});

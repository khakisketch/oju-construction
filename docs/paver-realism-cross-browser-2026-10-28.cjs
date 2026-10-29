const fs=require('node:fs');
const vm=require('node:vm');
const {firefox,webkit}=require('playwright-core');
(async()=>{
  const code=fs.readFileSync('docs/paver-realism-browser-check-2026-10-28.js','utf8');
  for(const [name,type] of [['firefox',firefox],['webkit',webkit]]){
    const run=vm.runInThisContext(code.replaceAll('.next/paver-realism-v1-acceptance/',
      '.next/paver-realism-v1-acceptance/'+name+'-'));
    const browser=await type.launch({headless:true});
    try{console.log(JSON.stringify({name,...await run(await browser.newPage())}));}
    finally{await browser.close();}
  }
})().catch(e=>{console.error(e);process.exitCode=1});

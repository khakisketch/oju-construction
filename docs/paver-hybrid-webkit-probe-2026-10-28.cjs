// Differential local probe for WebKit's video-ready path. Uses Playwright 1.60.
const {webkit}=require('playwright-core');

(async()=>{
  const browser=await webkit.launch({headless:true});
  let failed=false;
  for(const [name,file] of [
    ['original','renewal-b-paver-story-proposal-2026-10-28.html'],
    ['hybrid','renewal-b-paver-hybrid-proposal-2026-10-28.html']
  ]){
    const p=await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];
    p.on('pageerror',error=>errors.push(error.message));
    await p.goto('http://127.0.0.1:5578/docs/'+file,{waitUntil:'load'});
    let ok=true;
    try{await p.waitForFunction(()=>document.querySelector('#paver-video').readyState>=2,null,{timeout:10000});}
    catch{ok=false;}
    const state=await p.evaluate(()=>{
      const v=document.querySelector('#paver-video');
      return {ready:v.readyState,network:v.networkState,error:v.error&&{code:v.error.code,message:v.error.message},
        src:v.currentSrc,failed:document.querySelector('#scene-paver').classList.contains('media-fail'),
        loading:document.querySelector('#paver-frame').classList.contains('loading')};
    });
    console.log(JSON.stringify({name,ok,state,errors}));
    if(name==='hybrid'&&!ok) failed=true;
    await p.close();
  }
  await browser.close();
  if(failed) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1});

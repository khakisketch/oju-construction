// Smoke check the tailnet-only static study, not a production deployment.
async page=>{
  const url='https://dgx-spark-1.tailda9552.ts.net:10021/b-paver-realism-stills.html?v=20261028-realism3';
  const c=await page.context().browser().newContext({viewport:{width:390,height:844}});
  const p=await c.newPage(),errors=[],bad=[];
  p.on('pageerror',e=>errors.push(e.message));
  p.on('response',r=>{if(r.url().includes('tailda9552.ts.net:10021/')&&r.status()>=400)bad.push({status:r.status(),url:r.url()});});
  const response=await p.goto(url,{waitUntil:'load'});
  await p.waitForFunction(()=>document.fonts.status==='loaded',null,{timeout:10000});
  await p.locator('#normal-title').scrollIntoViewIfNeeded();
  await p.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth===1920));
  const info=await p.evaluate(()=>({images:document.images.length,
    disclosure:document.querySelector('.intro').innerText.includes('실제 현장 아님'),
    caveat:document.querySelector('.study figcaption').innerText.includes('판정할 수는 없습니다'),
    credits:document.querySelector('footer').innerText.includes('SG_161222'),
    forms:document.forms.length,scripts:document.scripts.length,
    width:[document.documentElement.clientWidth,document.documentElement.scrollWidth]}));
  await p.evaluate(()=>scrollTo(0,0));
  await p.screenshot({path:'.next/paver-realism-v1-acceptance/shared-mobile-first.png'});
  if(response.status()!==200||info.images!==2||!info.disclosure||!info.caveat||!info.credits||
    info.forms||info.scripts||info.width[0]!==info.width[1]||errors.length||bad.length)
    throw new Error(JSON.stringify({status:response.status(),info,errors,bad}));
  await c.close();return {status:response.status(),info,errors,bad};
}

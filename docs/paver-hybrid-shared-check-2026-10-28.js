// Smoke-check the existing tailnet-only preview, not the official site.
async page => {
  const url='https://dgx-spark-1.tailda9552.ts.net:10021/b-paver-hybrid.html?v=20261028-hybrid2';
  const browser=page.context().browser();
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const p=await context.newPage(),errors=[],bad=[];
  p.on('pageerror',e=>errors.push(e.message));
  p.on('response',r=>{if(r.url().startsWith('https://dgx-spark-1.tailda9552.ts.net:10021/')&&r.status()>=400)bad.push({status:r.status(),url:r.url()});});
  const response=await p.goto(url,{waitUntil:'load'});
  await p.evaluate(async()=>{document.documentElement.style.scrollBehavior='auto';await document.fonts.ready;});
  await p.waitForFunction(()=>document.querySelector('#paver-video').readyState>=2,null,{timeout:20000});
  const geom=await p.evaluate(()=>{const s=document.querySelector('#paver-scroll'),t=s.querySelector('.paver-sticky');
    return {start:s.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(t).top)||0),span:s.offsetHeight-t.offsetHeight};});
  await p.evaluate(g=>scrollTo(0,g.start+.8*g.span),geom);
  await p.waitForFunction(()=>document.querySelector('#paver-cap-k').textContent.startsWith('4/5')&&!document.querySelector('#paver-video').seeking,null,{timeout:10000});
  const state=await p.evaluate(()=>({time:document.querySelector('#paver-video').currentTime,
    caption:document.querySelector('#paver-cap-k').textContent,
    failed:document.querySelector('#scene-paver').classList.contains('media-fail'),
    phone:!!document.querySelector('a[href="tel:043-265-6010"]'),
    formDisabled:document.querySelector('.form-disabled').disabled,
    attribution:document.querySelector('footer').innerText.includes('RealVisXL V5.0 · SG_161222'),
    width:[document.documentElement.clientWidth,document.documentElement.scrollWidth]}));
  await p.screenshot({path:'.next/paver-hybrid-acceptance/shared-mobile-settled.png'});
  if(response.status()!==200||state.time<1.5||state.failed||!state.phone||!state.formDisabled||!state.attribution||state.width[0]!==state.width[1]||bad.length||errors.length)
    throw new Error(JSON.stringify({status:response.status(),state,bad,errors}));
  await context.close();
  return {status:response.status(),state,bad,errors};
}

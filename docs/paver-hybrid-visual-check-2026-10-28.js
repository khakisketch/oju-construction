// Rendered evidence for the isolated proposal. Run with playwright-cli run-code.
async page => {
  const browser=page.context().browser();
  const url='http://127.0.0.1:5578/docs/renewal-b-paver-hybrid-proposal-2026-10-28.html';
  const results=[];
  for (const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['short',568,320]]) {
    const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});
    const p=await context.newPage();
    const errors=[];
    p.on('pageerror',e=>errors.push(e.message));
    await p.goto(url,{waitUntil:'load'});
    await p.evaluate(async()=>{document.documentElement.style.scrollBehavior='auto';await document.fonts.ready});
    await p.waitForFunction(()=>document.querySelector('#paver-video').readyState>=2, null,{timeout:20000});
    if(name!=='short') await p.screenshot({path:'.next/paver-hybrid-acceptance/'+name+'-first.png'});
    const metric=await p.evaluate(()=>{
      const s=document.querySelector('#paver-scroll'),t=s.querySelector('.paver-sticky');
      return {start:s.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(t).top)||0),span:s.offsetHeight-t.offsetHeight,position:getComputedStyle(t).position};
    });
    if(metric.span>0 && metric.position==='sticky'){
      await p.evaluate(m=>scrollTo(0,m.start+m.span*.6),metric);
      await p.waitForFunction(()=>document.querySelector('#paver-cap-k').textContent.startsWith('3/5')&&!document.querySelector('#paver-video').seeking,null,{timeout:10000});
    }else{
      await p.evaluate(()=>document.querySelector('#paver-video').scrollIntoView({block:'center'}));
    }
    await p.screenshot({path:'.next/paver-hybrid-acceptance/'+name+'-middle.png'});
    const state=await p.evaluate(()=>{
      const v=document.querySelector('#paver-video').getBoundingClientRect(),
        cap=document.querySelector('.paver-cap').getBoundingClientRect(),
        nav=document.querySelector('.paver-nav').getBoundingClientRect(),
        header=document.querySelector('.top').getBoundingClientRect(),
        bar=document.querySelector('.mobile-bar').getBoundingClientRect();
      return {caption:document.querySelector('#paver-cap-k').textContent,
        video:{top:v.top,bottom:v.bottom,width:v.width},captionTop:cap.top,
        navBottom:nav.bottom,headerBottom:header.bottom,mobileBarTop:bar.top,
        viewport:[innerWidth,innerHeight],documentWidth:document.documentElement.scrollWidth};
    });
    results.push({name,state,errors});
    if(metric.span>0 && metric.position==='sticky'){
      await p.evaluate(m=>scrollTo(0,m.start+m.span*.8),metric);
      await p.waitForFunction(()=>document.querySelector('#paver-cap-k').textContent.startsWith('4/5')&&!document.querySelector('#paver-video').seeking,null,{timeout:10000});
      await p.screenshot({path:'.next/paver-hybrid-acceptance/'+name+'-settled.png'});
    }
    await context.close();
  }
  for(const kind of ['failed','nojs','reduced']){
    const context=await browser.newContext({viewport:{width:390,height:844},
      javaScriptEnabled:kind!=='nojs',reducedMotion:kind==='reduced'?'reduce':'no-preference'});
    const p=await context.newPage();
    if(kind==='failed')await p.route('**/paver-hybrid-settlement-2026-10-28.mp4*',route=>route.fulfill({status:404,body:''}));
    await p.goto(url+'?visual='+kind,{waitUntil:'load'});
    if(kind==='failed')await p.waitForFunction(()=>document.querySelector('#scene-paver').classList.contains('media-fail'));
    if(kind==='reduced')await p.waitForFunction(()=>document.querySelector('#paver-video').readyState>=2);
    await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelector('#paver-frame').scrollIntoView({block:'center'});});
    await p.screenshot({path:'.next/paver-hybrid-acceptance/mobile-'+kind+'.png'});
    results.push({name:'mobile-'+kind,loaded:await p.evaluate(()=>({
      poster:document.querySelector('.paver-poster').complete,
      failed:document.querySelector('#scene-paver').classList.contains('media-fail'),
      position:getComputedStyle(document.querySelector('.paver-sticky')).position}))});
    await context.close();
  }
  return results;
}

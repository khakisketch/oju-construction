// Standalone Playwright CLI regression for the isolated static preview.
// Serve the repository with a server that returns 200, not 206, to Range
// requests (for example Python's http.server on 127.0.0.1:5578).
async page => {
  const browser = page.context().browser();
  const root = 'http://127.0.0.1:5578';
  const url = root + '/docs/renewal-b-paver-hybrid-proposal-2026-10-28.html';
  const media = root + '/docs/paver-hybrid-settlement-2026-10-28.mp4';
  const results = [];
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const geometry = p => p.evaluate(() => {
    const scroll = document.querySelector('#paver-scroll');
    const sticky = scroll.querySelector('.paver-sticky');
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    return {start:scroll.getBoundingClientRect().top + scrollY - top, span:scroll.offsetHeight - sticky.offsetHeight};
  });
  const state = p => p.evaluate(() => {
    const video = document.querySelector('#paver-video');
    const frame = document.querySelector('#paver-frame');
    return {time:video.currentTime, ready:video.readyState, failed:frame.classList.contains('media-fail'),
      caption:document.querySelector('#paver-cap-k').textContent,
      width:[document.documentElement.clientWidth, document.documentElement.scrollWidth]};
  });
  const jump = async (p, geometry, progress) => {
    await p.evaluate(y => scrollTo(0, y), geometry.start + geometry.span * progress);
    await p.waitForTimeout(350);
    return state(p);
  };

  const probe = await page.context().request.get(media, {headers:{Range:'bytes=0-100'}});
  assert(probe.status() === 200, 'Use the documented no-Range HTTP server for this regression.');
  for (const [width,height] of [[1440,900],[390,844]]) {
    for (let run=0; run<3; run++) {
      const c = await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});
      const p = await c.newPage();
      const errors = [];
      p.on('pageerror', error => errors.push(error.message));
      await p.goto(url, {waitUntil:'load'});
      await p.evaluate(async () => {document.documentElement.style.scrollBehavior='auto'; await document.fonts.ready;});
      try {
        await p.waitForFunction(() => document.querySelector('#paver-video').readyState >= 2, null, {timeout:20000});
      } catch (error) {
        const diagnostic = await p.evaluate(() => {
          const v=document.querySelector('#paver-video');
          return {ready:v.readyState,network:v.networkState,error:v.error&&v.error.code,
            failed:document.querySelector('#scene-paver').classList.contains('media-fail'),
            loading:document.querySelector('#paver-frame').classList.contains('loading')};
        });
        throw new Error('Video not ready at '+width+'x'+height+' run '+run+': '+JSON.stringify(diagnostic));
      }
      const layout = await p.evaluate(() => {
        const rect = selector => document.querySelector(selector).getBoundingClientRect();
        const video=rect('#paver-video'),caption=rect('.paver-cap'),legend=rect('.paver-legend'),frame=rect('#paver-frame');
        return {videoBottom:video.bottom,captionTop:caption.top,captionBottom:caption.bottom,
          legendTop:legend.top,legendBottom:legend.bottom,frameBottom:frame.bottom};
      });
      assert(layout.captionTop >= layout.videoBottom - 1 && layout.legendTop >= layout.captionBottom - 1 &&
        layout.legendBottom <= layout.frameBottom + 1,
        'Caption or legend covers the model or is clipped: '+JSON.stringify(layout));
      const g = await geometry(p);
      assert(g.span > 0, 'Expected a scroll-linked stage at '+width+'x'+height);
      const first = await jump(p,g,0), forward = await jump(p,g,.8), last = await jump(p,g,.98);
      const finalLayout=await p.evaluate(()=>{
        const frame=document.querySelector('#paver-frame').getBoundingClientRect();
        const legend=document.querySelector('.paver-legend').getBoundingClientRect();
        const key=document.querySelector('#paver-zonekey');
        return {frameBottom:frame.bottom,legendBottom:legend.bottom,keyHidden:key.hidden,
          keyDisplay:getComputedStyle(key).display};
      });
      assert(!finalLayout.keyHidden && finalLayout.keyDisplay==='block' &&
        finalLayout.legendBottom <= finalLayout.frameBottom+1,
        'Final repair labels are hidden or clipped: '+JSON.stringify(finalLayout));
      if (width === 390) {
        const key = await p.evaluate(() => {
          const e=document.querySelector('#paver-zonekey'),nav=document.querySelector('.paver-nav').getBoundingClientRect();
          const bar=document.querySelector('.mobile-bar').getBoundingClientRect();
          return {hidden:e.hidden,display:getComputedStyle(e).display,text:e.innerText,navBottom:nav.bottom,barTop:bar.top};
        });
        assert(!key.hidden && key.display==='block' && key.text.includes('A 표면') && key.text.includes('C 배수·관로') && key.navBottom <= key.barTop,
          'Mobile repair-range labels are hidden or covered: '+JSON.stringify(key));
      }
      const reverse = await jump(p,g,0);
      assert(forward.time > 1.5 && reverse.time < .2, 'Forward/reverse video seek failed: '+JSON.stringify({first,forward,reverse}));
      assert(forward.caption.startsWith('4/5') && last.caption.startsWith('5/5') && reverse.caption.startsWith('1/5'), 'Video and stage captions disagree.');
      assert(forward.width[0] === forward.width[1] && !errors.length, 'Overflow or page error: '+JSON.stringify(errors));
      results.push({viewport:[width,height],run,forward:forward.time,reverse:reverse.time});
      await c.close();
    }
  }

  const decodeRetry=[];
  for (const failures of [1,2,3]) {
    const retryContext=await browser.newContext({viewport:{width:390,height:844}});
    await retryContext.addInitScript(({failures}) => {
      const original=HTMLMediaElement.prototype.load;
      const src=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'src');
      Object.defineProperty(HTMLMediaElement.prototype,'src',{
        configurable:true,enumerable:src.enumerable,get:src.get,
        set(value){
          // Suppress the real load for the simulated failures, otherwise a
          // fast decoder can reach canplay before the injected error fires.
          if(this.id==='paver-video'&&(window.__paverDecodeAttempts||0)<failures)return;
          src.set.call(this,value);
        }
      });
      HTMLMediaElement.prototype.load=function(){
        if(this.id!=='paver-video')return original.call(this);
        window.__paverDecodeAttempts=(window.__paverDecodeAttempts||0)+1;
        if(window.__paverDecodeAttempts<=failures){
          Object.defineProperty(this,'error',{configurable:true,value:{code:4}});
          setTimeout(()=>this.dispatchEvent(new Event('error')),0);
          return;
        }
        delete this.error;
        return original.call(this);
      };
    },{failures});
    const retryPage=await retryContext.newPage();
    await retryPage.goto(url+'?test=decode-retry-'+failures,{waitUntil:'load'});
    await retryPage.waitForFunction(()=>document.querySelector('#paver-video').readyState>=2||
      document.querySelector('#scene-paver').classList.contains('media-fail'),null,{timeout:20000});
    const retry=await retryPage.evaluate(()=>({attempts:window.__paverDecodeAttempts,
      ready:document.querySelector('#paver-video').readyState,
      failed:document.querySelector('#scene-paver').classList.contains('media-fail'),
      poster:getComputedStyle(document.querySelector('.paver-poster')).display}));
    assert(retry.attempts===(failures<3?failures+1:3) &&
      (failures<3 ? retry.ready>=2&&!retry.failed : retry.failed&&retry.poster==='block'),
      'A transient or repeated decoder error did not recover/fall back: '+JSON.stringify({failures,retry}));
    decodeRetry.push({simulatedFailures:failures,...retry});
    await retryContext.close();
  }

  const c = await browser.newContext({viewport:{width:390,height:844}});
  const p = await c.newPage();
  await p.route('**/paver-hybrid-settlement-2026-10-28.mp4*', route => route.fulfill({status:404,body:''}));
  await p.goto(url+'?test=404', {waitUntil:'load'});
  await p.waitForFunction(() => document.querySelector('#scene-paver').classList.contains('media-fail'), null, {timeout:5000});
  const fallback = await p.evaluate(() => {
    const stage=document.querySelector('#paver-scroll'), sticky=stage.querySelector('.paver-sticky');
    const frame=document.querySelector('#paver-frame');
    return {position:getComputedStyle(sticky).position, height:stage.offsetHeight,
      nav:getComputedStyle(document.querySelector('.paver-nav')).display,
      poster:getComputedStyle(frame.querySelector('.paver-poster')).display,
      note:document.querySelector('.paver-failnote').innerText,
      steps:document.querySelectorAll('.paver-step').length};
  });
  assert(fallback.position === 'static' && fallback.height < 1688 && fallback.nav === 'none' &&
    fallback.poster === 'block' && fallback.note.includes('정지 화면') && fallback.steps === 5,
    'Media failure did not expose a concise static alternative: '+JSON.stringify(fallback));
  await c.close();

  const lateContext = await browser.newContext({viewport:{width:390,height:844}});
  const latePage = await lateContext.newPage();
  let held, routeSeen;
  const routeReady = new Promise(resolve => {routeSeen=resolve;});
  await latePage.route('**/paver-hybrid-settlement-2026-10-28.mp4*', route => {held=route;routeSeen();});
  await latePage.goto(url+'?test=late', {waitUntil:'domcontentloaded'});
  await routeReady;
  await latePage.evaluate(() => {document.documentElement.style.scrollBehavior='auto';});
  const lateGeometry=await geometry(latePage);
  const whileLoading=await jump(latePage,lateGeometry,.8);
  const loadingInfo=await latePage.evaluate(() => ({visibility:getComputedStyle(document.querySelector('#paver-video')).visibility,
    disabled:[...document.querySelectorAll('.paver-nav button')].every(button=>button.disabled)}));
  assert(whileLoading.caption.startsWith('1/5') && loadingInfo.visibility==='hidden' && loadingInfo.disabled,
    'The loading state paired a stale picture with a later caption.');
  await held.continue();
  await latePage.waitForFunction(() => document.querySelector('#paver-video').readyState >= 2, null, {timeout:10000});
  await latePage.waitForTimeout(400);
  const loadedLate=await state(latePage);
  assert(loadedLate.time>1.5 && loadedLate.caption.startsWith('4/5'), 'Late media did not catch up to scroll position.');
  await jump(latePage,lateGeometry,.98);
  const postReadyFailure=await latePage.evaluate(() => {
    const video=document.querySelector('#paver-video');
    // Simulate a browser-reported decode error after the first frame became ready.
    Object.defineProperty(video,'error',{configurable:true,value:{code:3}});
    video.dispatchEvent(new Event('error'));
    return document.querySelector('#scene-paver').classList.contains('media-fail') && document.querySelector('#paver-zonekey').hidden;
  });
  assert(postReadyFailure, 'A decode error after readiness did not show the fallback.');
  await lateContext.close();

  const cacheContext=await browser.newContext({viewport:{width:390,height:844}});
  const cachePage=await cacheContext.newPage();
  await cachePage.goto(url+'?test=cache', {waitUntil:'load'});
  await cachePage.waitForFunction(() => document.querySelector('#paver-video').readyState >= 2, null, {timeout:10000});
  await cachePage.evaluate(() => {document.documentElement.style.scrollBehavior='auto';});
  const cacheGeometry=await geometry(cachePage);
  await jump(cachePage,cacheGeometry,.98);
  const simulatedReturn=await cachePage.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));
    window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));
    return {loading:document.querySelector('#paver-frame').classList.contains('loading'),
      caption:document.querySelector('#paver-cap-k').textContent,keyHidden:document.querySelector('#paver-zonekey').hidden,
      disabled:[...document.querySelectorAll('.paver-nav button')].every(button=>button.disabled)};
  });
  assert(simulatedReturn.loading && simulatedReturn.caption.startsWith('1/5') && simulatedReturn.keyHidden && simulatedReturn.disabled,
    'The simulated cache return left a stale caption or enabled controls.');
  await cachePage.waitForFunction(() => !document.querySelector('#paver-frame').classList.contains('loading') &&
    document.querySelector('#paver-video').readyState >= 2, null, {timeout:10000});
  await cachePage.waitForTimeout(400);
  const cacheRestored=await state(cachePage);
  assert(cacheRestored.time>2 && cacheRestored.caption.startsWith('5/5'), 'The simulated cache return did not restore the current scene.');
  await cacheContext.close();

  const stalledContext = await browser.newContext({viewport:{width:390,height:844}});
  const stalledPage = await stalledContext.newPage();
  let stalled, stalledSeen;
  const stalledReady = new Promise(resolve => {stalledSeen=resolve;});
  await stalledPage.route('**/paver-hybrid-settlement-2026-10-28.mp4*', route => {stalled=route;stalledSeen();});
  await stalledPage.goto(url+'?test=stalled', {waitUntil:'domcontentloaded'});
  await stalledReady;
  const stallStarted=Date.now();
  await stalledPage.waitForFunction(() => document.querySelector('#scene-paver').classList.contains('media-fail'), null, {timeout:18000});
  const stallDuration=Date.now()-stallStarted;
  const stallInfo=await stalledPage.evaluate(() => ({position:getComputedStyle(document.querySelector('.paver-sticky')).position,
    note:document.querySelector('.paver-failnote').innerText,steps:document.querySelectorAll('.paver-step').length}));
  assert(stallInfo.position==='static' && stallInfo.note.includes('정지 화면') && stallInfo.steps===5,
    'A stalled media request did not expose the static narrative.');
  await stalled.abort().catch(()=>{});
  await stalledContext.close();

  const short = await browser.newContext({viewport:{width:568,height:320}});
  const sp = await short.newPage();
  await sp.goto(url+'?test=landscape', {waitUntil:'load'});
  await sp.waitForFunction(() => document.querySelector('#paver-video').readyState >= 2, null, {timeout:20000});
  await sp.evaluate(() => {document.documentElement.style.scrollBehavior='auto';document.querySelector('#paver-video').scrollIntoView({block:'center'});});
  await sp.waitForTimeout(300);
  const fit = await sp.evaluate(() => {
    const video=document.querySelector('#paver-video').getBoundingClientRect();
    const header=document.querySelector('.top').getBoundingClientRect();
    const bar=document.querySelector('.mobile-bar').getBoundingClientRect();
    return {width:video.width, top:video.top, bottom:video.bottom, safe:[header.bottom,bar.top],
      viewport:[document.documentElement.clientWidth,document.documentElement.scrollWidth]};
  });
  assert(fit.width >= 280 && fit.top >= fit.safe[0]-3 && fit.bottom <= fit.safe[1]+3 && fit.viewport[0]===fit.viewport[1],
    'Short landscape model is cropped or too small: '+JSON.stringify(fit));
  await short.close();
  const nojsContext = await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
  const nojsPage = await nojsContext.newPage();
  await nojsPage.goto(url+'?test=nojs', {waitUntil:'load'});
  const nojs = await nojsPage.evaluate(() => {
    const poster=document.querySelector('.paver-poster');
    return {display:getComputedStyle(poster).display,loaded:poster.complete && poster.naturalWidth>0,
      steps:document.querySelectorAll('.paver-step').length,width:[document.documentElement.clientWidth,document.documentElement.scrollWidth]};
  });
  assert(nojs.display==='block' && nojs.loaded && nojs.steps===5 && nojs.width[0]===nojs.width[1],
    'No-script poster and text are not available: '+JSON.stringify(nojs));
  await nojsContext.close();
  return {browser:browser.version(),noRangeStatus:probe.status(),seek:results,decodeRetry,fallback,
    late:{whileLoading,loadingInfo,loadedLate,postReadyFailure},cache:{simulated:true,simulatedReturn,cacheRestored},
    stalled:{duration:stallDuration,...stallInfo},landscape:fit,nojs};
}

async page => {
  const browser=page.context().browser();
  const url='http://127.0.0.1:5578/docs/renewal-b-paver-hybrid-proposal-2026-10-28.html';
  const out=[];
  for(const [width,height,motion] of [[1440,900,'no-preference'],[390,844,'reduce']]){
    const context=await browser.newContext({viewport:{width,height},reducedMotion:motion});
    const p=await context.newPage();
    await p.goto(url,{waitUntil:'load'});
    await p.waitForFunction(()=>document.querySelector('#paver-video').readyState>=2,null,{timeout:20000});
    await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
    const scan=await p.evaluate(async()=>{
      const a=await axe.run(document,{resultTypes:['violations','incomplete']});
      return {violations:a.violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length})),
        incomplete:a.incomplete.map(v=>({id:v.id,count:v.nodes.length}))};
    });
    const slider=p.locator('#split-range');
    await slider.focus();
    const before=await slider.inputValue();
    await p.keyboard.press('ArrowRight');
    const after=await slider.inputValue();
    const info=await p.evaluate(()=>({
      reducedStatic:getComputedStyle(document.querySelector('.paver-sticky')).position,
      phone:[...document.querySelectorAll('a[href="tel:043-265-6010"]')].length,
      formDisabled:document.querySelector('.form-disabled').disabled,
      focus:getComputedStyle(document.activeElement).outlineStyle,
      overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
    }));
    if(before===after || !info.formDisabled || !info.phone || info.overflow || info.focus==='none')
      throw new Error('Keyboard, focus, contact or layout regression: '+JSON.stringify({before,after,info}));
    if(motion==='reduce' && info.reducedStatic!=='static') throw new Error('Reduced motion is not static');
    out.push({viewport:[width,height],motion,scan,keyboard:{before,after},info});
    await context.close();
  }
  return out;
}

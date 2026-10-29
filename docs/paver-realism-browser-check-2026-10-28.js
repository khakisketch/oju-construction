// Run through playwright-cli run-code after serving this repository on 5578.
async page => {
  const browser=page.context().browser();
  const url='http://127.0.0.1:5578/docs/renewal-b-paver-realism-stills-2026-10-28.html';
  const out=[];
  for(const [name,width,height,js,motion] of [
    ['desktop',1440,900,true,'no-preference'],
    ['mobile',390,844,true,'no-preference'],
    ['narrow-nojs',320,700,false,'no-preference'],
    ['short-reduced',568,320,true,'reduce']
  ]){
    const context=await browser.newContext({viewport:{width,height},javaScriptEnabled:js,reducedMotion:motion});
    const p=await context.newPage(),errors=[],bad=[];
    p.on('pageerror',e=>errors.push(e.message));
    p.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:5578/')&&r.status()>=400)bad.push({status:r.status(),url:r.url()});});
    await p.goto(url,{waitUntil:'load'});
    await p.waitForFunction(()=>document.fonts.status==='loaded',null,{timeout:10000});
    await p.waitForFunction(()=>{const i=document.querySelector('img');return i.complete&&i.naturalWidth>0;});
    await p.screenshot({path:'.next/paver-realism-v1-acceptance/'+name+'-first.png'});
    for(const state of ['settled','normal']){
      await p.evaluate(state=>document.getElementById(state+'-title').scrollIntoView({block:'start'}),state);
      await p.waitForFunction(state=>{const i=document.querySelector('[aria-labelledby="'+state+'-title"] img');return i.complete&&i.naturalWidth>0;},state);
      await p.screenshot({path:'.next/paver-realism-v1-acceptance/'+name+'-'+state+'.png'});
    }
    const info=await p.evaluate(()=>({
      images:[...document.querySelectorAll('img')].map(i=>({loaded:i.complete&&i.naturalWidth>0,
        width:i.naturalWidth,height:i.naturalHeight,alt:!!i.alt})),
      overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,
      motion:document.getAnimations().length,
      forms:document.forms.length,
      scripts:document.querySelectorAll('script').length,
      phone:!!document.querySelector('a[href="tel:043-265-6010"]'),
      disclosure:document.querySelector('.intro').innerText.includes('실제 현장 아님'),
      overlay:[...document.querySelectorAll('.render')].some(i=>getComputedStyle(i).position==='absolute')
    }));
    if(info.images.length!==2||info.images.some(i=>!i.loaded||!i.alt)||info.overflow||info.forms||info.scripts||
      !info.phone||!info.disclosure||info.overlay||errors.length||bad.length)
      throw new Error(JSON.stringify({name,info,errors,bad}));
    if(name==='desktop'){
      await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
      const scan=await p.evaluate(async()=>{const r=await axe.run(document);return{
        violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),
        incomplete:r.incomplete.map(v=>({id:v.id,count:v.nodes.length}))};});
      if(scan.violations.length)throw new Error('Accessibility violations '+JSON.stringify(scan));
      info.scan=scan;
    }
    out.push({name,viewport:[width,height],javaScript:js,motion,info,errors,bad});
    await context.close();
  }
  const keys=await browser.newContext({viewport:{width:390,height:844}});
  const kp=await keys.newPage();await kp.goto(url,{waitUntil:'load'});
  await kp.keyboard.press('Tab');
  const skip=await kp.locator(':focus').textContent();
  await kp.keyboard.press('Enter');
  const mainFocused=await kp.evaluate(()=>document.activeElement.id==='main');
  await kp.keyboard.press('Tab');
  const link=await kp.locator(':focus').getAttribute('href');
  if(skip!=='본문으로 바로가기'||!mainFocused||!link.endsWith('settled.png'))throw new Error('Keyboard reading path failed');
  await keys.close();
  return {browser:browser.version(),out,keyboard:{skip,mainFocused,link}};
}

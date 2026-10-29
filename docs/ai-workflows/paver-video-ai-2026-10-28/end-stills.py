import json,urllib.request,time,copy,os
D=os.path.dirname(__file__);s=json.load(open(D+'/reference-9.json'))['prompt'];s['6']['inputs']['image']='surface-start.png';s['10']['inputs']['text']='A close-up photograph of the same gray concrete paving blocks. A few rigid blocks in the center have sunk slightly lower than the neighboring blocks. Keep the same layout and the same camera position, realistic outdoor pavement, fine concrete texture, dark sand joints.'
for i,den in [(11,0.25),(12,0.4)]:
 q=copy.deepcopy(s);q['11']['inputs'].update(seed=2026102900+i,denoise=den);q['13']['inputs']['filename_prefix']='reference-'+str(i);p={'client_id':'oju-batch3','prompt':q};json.dump(p,open(f'{D}/reference-{i}.json','w'),indent=2);b='http://127.0.0.1:18391';req=urllib.request.Request(b+'/prompt',data=json.dumps(p).encode(),headers={'Content-Type':'application/json'});pid=json.load(urllib.request.urlopen(req))['prompt_id'];print(i,'start',time.ctime(),flush=True)
 while True:
  time.sleep(3);h=json.load(urllib.request.urlopen(b+'/history/'+pid))
  if pid in h:json.dump(h[pid],open(f'{D}/reference-{i}-history.json','w'),indent=2);print(i,'done',h[pid]['status']['status_str'],time.ctime(),flush=True);break

import json,urllib.request,time,copy,os
D=os.path.dirname(__file__);s=json.load(open(D+'/reference-6.json'))['prompt'];s['6']={'class_type':'LoadImage','inputs':{'image':'section-seed.png'}};s['4']={'class_type':'VAEEncode','inputs':{'pixels':['6',0],'vae':['2',0]}};s['10']['inputs']['text']='Documentary photograph of the exposed wall of a real full size trench beside a sidewalk. Rows of gray concrete paving blocks, compacted small granular gravel and brown soil, one gray hollow drainage pipe exposed facing camera and a small cavity in the soil beside it. Realistic muted light, natural fine soil and stone textures, same layout.';s['11']['inputs']['denoise']=0.36
for i in (9,10):
 q=copy.deepcopy(s);q['11']['inputs']['seed']=2026102900+i;q['13']['inputs']['filename_prefix']='reference-'+str(i);p={'client_id':'oju-batch3','prompt':q};json.dump(p,open(f'{D}/reference-{i}.json','w'),indent=2);b='http://127.0.0.1:18391';req=urllib.request.Request(b+'/prompt',data=json.dumps(p).encode(),headers={'Content-Type':'application/json'});pid=json.load(urllib.request.urlopen(req))['prompt_id'];print(i,'start',time.ctime(),flush=True)
 while True:
  time.sleep(3);h=json.load(urllib.request.urlopen(b+'/history/'+pid))
  if pid in h:json.dump(h[pid],open(f'{D}/reference-{i}-history.json','w'),indent=2);print(i,'done',h[pid]['status']['status_str'],time.ctime(),flush=True);break

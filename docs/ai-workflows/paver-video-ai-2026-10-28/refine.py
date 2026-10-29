import json,urllib.request,time,copy,os
D=os.path.dirname(__file__);b='http://127.0.0.1:18391';base=json.load(open(D+'/candidate-14.json'))['prompt'];cases=[
 (18,'reference-5.png','Fixed locked camera, real outdoor paving blocks. A small local patch in the middle sags down smoothly into a shallow dip while all rectangular blocks stay flush, horizontal, rigid and attached. The rest of the pavement does not move. Do not lift, rotate, open or remove any block.'),
 (19,'reference-9.png','Fixed camera, exposed soil and one round hollow drainage pipe in the same location. A small patch of soil to the left of the pipe gently trickles down. The gray pipe, upper pavers, gravel, and the entire surrounding area stay fixed and unchanged. Natural documentary view, one local motion.')]
for n,img,text in cases:
 q=copy.deepcopy(base);q['5']['inputs']['image']=img;q['6']['inputs']['text']=text;q['7']['inputs']['text']+=', blocks rising, standing slabs, open hatch, popping up, new holes';q['11']['inputs']['noise_seed']=2026102900+n;q['12']['inputs']['noise_seed']=2026102900+n;q['14']['inputs']['filename_prefix']=f'candidate-{n}';p={'client_id':'oju-batch3','prompt':q};json.dump(p,open(f'{D}/candidate-{n}.json','w'),indent=2);req=urllib.request.Request(b+'/prompt',data=json.dumps(p).encode(),headers={'Content-Type':'application/json'});pid=json.load(urllib.request.urlopen(req))['prompt_id'];print(n,'start',pid,time.ctime(),flush=True)
 while True:
  time.sleep(8);h=json.load(urllib.request.urlopen(b+'/history/'+pid))
  if pid in h:json.dump(h[pid],open(f'{D}/candidate-{n}-history.json','w'),indent=2);print(n,'done',h[pid]['status']['status_str'],time.ctime(),flush=True);break

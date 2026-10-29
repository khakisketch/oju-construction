import json,copy,time,urllib.request
p=json.load(open('/home/ksi/Desktop/SI-Projects/OJU-EC/docs/ai-workflows/paver-wan-vace-14b-test-2026-10-28.json'))['prompt']
for n in ['6','7','8','9']: del p[n]
p['10']['inputs'].pop('control_video');p['10']['inputs'].pop('reference_image');p['10']['inputs'].update(width=640,height=384,length=49)
p['12']['inputs'].update(steps=20,cfg=6.0)
negative='cartoon, miniature, toy, CGI, diagram, cross section, pipe, text, logo, camera movement, zoom, pan, flicker, warped, melted, changing geometry, blurry, people, vehicles'
p['5']['inputs']['text']=negative
prompts=[
'Tripod locked-off documentary video looking down at a real outdoor pedestrian walkway paved with rectangular concrete pavers. A localized shallow depression in the center of the pavers with a small puddle. Overcast natural daylight, ordinary weathered concrete, realistic construction site, no people. Raindrops gently ripple the puddle while the surrounding pavers remain completely still. Fixed framing, realistic live action footage.',
'Fixed locked tripod camera at a low oblique angle looking over a real grey interlocking concrete block sidewalk after rain. A small shallow puddle lies in a localized low spot. Subtle raindrops strike the puddle, tiny ripples spread naturally. The pavers stay solid, rigid and unchanged. Natural diffuse daylight, documentary realism, no people, no moving camera.',
'Fixed overhead tripod view of an outdoor pedestrian paving block walkway in natural daylight. A small patch of solid rectangular pavers slowly settles downward together as a coherent group, leaving a shallow dip where a little rainwater gathers. The camera stays perfectly still and all the pavers maintain their rigid rectangular shape and their grout joints. Photorealistic documentary footage.' ]
base='http://127.0.0.1:18389'
for i,t in enumerate(prompts,1):
 q=copy.deepcopy(p);q['4']['inputs']['text']=t;q['12']['inputs']['seed']=2026102800+i;q['15']['inputs']['filename_prefix']=f'candidate-{i}'
 payload={'prompt':q,'client_id':'oju-local-video'}
 json.dump(payload,open(f'/tmp/opencode/oju-video-VSg1Xv/candidate-{i}.json','w'),indent=2)
 req=urllib.request.Request(base+'/prompt',data=json.dumps(payload).encode(),headers={'Content-Type':'application/json'})
 try:
  res=json.load(urllib.request.urlopen(req)); pid=res['prompt_id']; print('started',i,pid,time.ctime(),flush=True)
  while True:
   time.sleep(10); history=json.load(urllib.request.urlopen(base+'/history/'+pid))
   if pid in history:
    json.dump(history[pid],open(f'/tmp/opencode/oju-video-VSg1Xv/history-{i}.json','w'),indent=2);print('finished',i,history[pid]['status'],time.ctime(),flush=True);break
 except Exception as e: print('ERROR',i,repr(e),flush=True);break

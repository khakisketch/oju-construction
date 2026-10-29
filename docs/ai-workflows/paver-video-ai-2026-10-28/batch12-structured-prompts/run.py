import os,sys,json,time,subprocess,urllib.request,pathlib,shutil,signal
D=pathlib.Path(__file__).resolve().parent
TEMP=pathlib.Path('/tmp/opencode/oju-batch12-structured'); TEMP.mkdir(exist_ok=False)
PORT=18412; BASE=f'http://127.0.0.1:{PORT}'
source=pathlib.Path('/tmp/opencode/oju-video-batch2-Pz9zV5')
for sub in ('input','output','temp','user'): (TEMP/sub).mkdir()
(TEMP/'models.yaml').write_text('batch2:\n  base_path: /tmp/opencode/oju-video-batch2-Pz9zV5/models\n  diffusion_models: diffusion_models\n  vae: vae\nwan:\n  base_path: /tmp/opencode/oju-paver-wan-v1/models\n  text_encoders: text_encoders\n')
neg='toy, miniature, scale model, tabletop, plinth, floating slabs, overhang, giant hole, black rectangular hole, hatch, raised blocks, new objects, melting or bending concrete, changing brick pattern, morphing, camera movement, pan, zoom, flicker, text, labels, logo, people, water, pipe, cartoon, CGI, plastic'
base='Photorealistic documentary footage of an ordinary outdoor concrete-paver sidewalk beside an existing shallow inspection trench. Locked tripod, natural overcast daylight, realistic full scale and granular textures. A continuous field of many individual weathered gray rectangular pavers, thin sand bedding, compacted crushed aggregate and brown soil form one connected construction. The camera and surroundings stay fixed. First hold still; then a small area of the paved surface slowly settles down together while each concrete paver remains rigid and recognizable; finally the movement stops. No cause is shown or claimed.'
prompts={
'A-oblique':base+' Camera at a three-quarter oblique angle, looking across the top of the sidewalk and down the exposed side of the trench at the same time. Top joints, thin sand and aggregate below the pavers are visible together. Earth continues beyond the frame; this is not a freestanding block.',
'B-section':base+' Camera looks almost horizontally at the vertical wall of the existing trench. At the upper edge see the sidewalk top receding into the background and beneath it a narrow continuous bedding and aggregate, merging into natural earth. The excavated soil wall extends beyond all image edges; no freestanding display.',
'C-surface': 'Photorealistic documentary footage of an ordinary outdoor concrete-paver sidewalk. Locked tripod, natural overcast daylight, realistic full scale and rough gray concrete textures. Camera looks obliquely across many individual rectangular pavers. First hold still; then a small group slowly settles down together while each concrete paver remains rigid and recognizable; finally the movement stops. Surrounding pavement and camera stay fixed. Only the surface is visible; no underground cause is shown.'}

def check(server=None, threshold=40):
 mem=int(next(x.split()[1] for x in open('/proc/meminfo') if x.startswith('MemAvailable:')))
 out=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,process_name','--format=csv,noheader'],text=True)
 allowed={94107};
 if server: allowed.add(server.pid)
 foreign=[x for x in out.strip().splitlines() if x.strip() and int(x.split(',')[0]) not in allowed]
 with open(D/'guard.log','a') as f:f.write(f'{time.time()} mem_kib={mem} compute={out.strip()!r} foreign={foreign!r}\n')
 if mem <= threshold*1024*1024 or foreign: raise RuntimeError(f'guard stop: mem_kib={mem} foreign={foreign}')
def get(path):return json.load(urllib.request.urlopen(BASE+path,timeout=5))
def post(path,obj):return json.load(urllib.request.urlopen(urllib.request.Request(BASE+path,data=json.dumps(obj).encode(),headers={'Content-Type':'application/json'}),timeout=10))
server=None
try:
 check(threshold=75)
 log=open(TEMP/'server.log','w')
 server=subprocess.Popen(['/home/ksi/ComfyUI/.venv/bin/python','/home/ksi/ComfyUI/main.py','--base-directory',str(TEMP),'--extra-model-paths-config',str(TEMP/'models.yaml'),'--listen','127.0.0.1','--port',str(PORT),'--disable-all-custom-nodes','--disable-api-nodes'],stdout=log,stderr=subprocess.STDOUT)
 for i in range(60):
  check(server)
  if server.poll() is not None:raise RuntimeError('server exited')
  try:get('/system_stats');break
  except Exception:time.sleep(2)
 else:raise RuntimeError('startup timeout')
 for name,text in prompts.items():
  check(server,75)
  q=json.load(open(D.parent/'candidate-9.json')); q['client_id']='batch12-structured'; graph=q['prompt']; graph['4']['inputs']['text']=text;graph['5']['inputs']['text']=neg;graph['12']['inputs']['seed']=2026102912;graph['15']['inputs']['filename_prefix']='batch12-'+name
  (D/(name+'.json')).write_text(json.dumps(q,indent=2,ensure_ascii=False))
  pid=post('/prompt',q)['prompt_id'];print('started',name,pid,flush=True)
  while True:
   time.sleep(4);check(server)
   if server.poll() is not None:raise RuntimeError('server exited during generation')
   h=get('/history/'+pid)
   if pid in h:
    h=h[pid];(D/(name+'-history.json')).write_text(json.dumps(h,indent=2));
    if h['status']['status_str']!='success':raise RuntimeError('generation failed '+str(h['status']))
    break
  files=sorted((TEMP/'output').glob('batch12-'+name+'_*.png'))
  if len(files)!=49:raise RuntimeError(f'unexpected frames {len(files)}')
  subprocess.run(['ffmpeg','-v','error','-y','-framerate','16','-pattern_type','glob','-i',str(TEMP/'output'/('batch12-'+name+'_*.png')),'-c:v','libx264','-crf','20','-pix_fmt','yuv420p',str(D/(name+'.mp4'))],check=True)
  from PIL import Image,ImageDraw
  grid=Image.new('RGB',(7*160,7*96));sheet=Image.new('RGB',(3*640,3*384))
  for i,f in enumerate(files):
   im=Image.open(f).convert('RGB'); grid.paste(im.resize((160,96)),((i%7)*160,(i//7)*96))
  for j,i in enumerate([0,6,12,18,24,30,36,42,48]):sheet.paste(Image.open(files[i]).convert('RGB'),((j%3)*640,(j//3)*384))
  grid.save(D/(name+'-all-frames.jpg'),quality=90);sheet.save(D/(name+'-samples.jpg'),quality=90)
  print('done',name,flush=True)
finally:
 if server and server.poll() is None:
  server.terminate()
  try:server.wait(timeout=15)
  except subprocess.TimeoutExpired:server.kill();server.wait()
 print('server cleaned',server.poll() if server else 'not started',flush=True)

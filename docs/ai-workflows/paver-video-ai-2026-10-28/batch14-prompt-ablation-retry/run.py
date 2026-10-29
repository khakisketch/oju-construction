import os,json,time,subprocess,urllib.request,pathlib,shutil,threading,tempfile
D=pathlib.Path(__file__).resolve().parent
TMP=pathlib.Path(tempfile.mkdtemp(prefix='oju-batch14-',dir='/tmp/opencode'))
PORT=18414; URL=f'http://127.0.0.1:{PORT}'
P={0:'Locked camera looking at the same outdoor concrete pavers. A paver near the center slowly sinks slightly. The surrounding pavement stays still.',1:'Locked camera looking at the same outdoor concrete pavers. At first the marked paver near the center is beside its neighboring pavers. Slowly the same paver with the same surface marks moves down a little relative to its neighbors, then rests slightly lower than them. Its concrete stays rigid, its outline and marks remain recognizable, and a narrow ordinary joint remains between it and its neighbors. The surrounding pavement stays still.'}
N={0:'camera movement, pan, zoom, flicker, people, text, logo, cartoon, toy, CGI',1:'camera movement, pan, zoom, flicker, people, text, logo, cartoon, toy, CGI, newly appearing slab, raised hatch, wide pit, elastic concrete, curved or bent pavers'}
server=None; stop=threading.Event(); failed=threading.Event(); reason=[]
def snapshot(threshold,own=None):
 m=int(next(x.split()[1] for x in open('/proc/meminfo') if x.startswith('MemAvailable:')))
 out=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,process_name','--format=csv,noheader'],text=True,timeout=5)
 foreign=[]
 for row in out.strip().splitlines():
  if not row.strip():continue
  pid,name=[v.strip() for v in row.split(',',1)];pid=int(pid)
  if (pid==94107 and name=='/usr/libexec/gnome-remote-desktop-daemon') or (own is not None and pid==own):continue
  foreign.append(row)
 with open(D/'guard.log','a') as f:f.write(f'{time.time()} mem_kib={m} compute={out.strip()!r} foreign={foreign!r}\n')
 if m<=threshold*1024*1024 or foreign:raise RuntimeError(f'unsafe mem_kib={m} foreign={foreign}')
def watch():
 while not stop.wait(4):
  try:snapshot(40,server.pid)
  except Exception as e:
   reason.append(str(e));failed.set()
   if server.poll() is None:server.terminate()
   return
def get(path):return json.load(urllib.request.urlopen(URL+path,timeout=8))
def post(path,obj):return json.load(urllib.request.urlopen(urllib.request.Request(URL+path,data=json.dumps(obj).encode(),headers={'Content-Type':'application/json'}),timeout=10))
def safe():
 if failed.is_set():raise RuntimeError('guard: '+str(reason))
 if server.poll() is not None:raise RuntimeError('own server exited')
for sub in ('input','output','temp','user'):(TMP/sub).mkdir()
shutil.copyfile(D/'reference-5.png',TMP/'input/reference-5.png')
(TMP/'models.yaml').write_text('experts:\n  base_path: /tmp/opencode/oju-video-batch3-5IiH3a/models\n  diffusion_models: diffusion_models\nwan:\n  base_path: /tmp/opencode/oju-paver-wan-v1/models\n  text_encoders: text_encoders\n  vae: vae\n')
(D/'runtime.txt').write_text('Temporary base: '+str(TMP)+'\n')
try:
 snapshot(75)
 log=open(TMP/'server.log','w')
 server=subprocess.Popen(['/home/ksi/ComfyUI/.venv/bin/python','/home/ksi/ComfyUI/main.py','--base-directory',str(TMP),'--extra-model-paths-config',str(TMP/'models.yaml'),'--listen','127.0.0.1','--port',str(PORT),'--disable-all-custom-nodes','--disable-api-nodes'],stdout=log,stderr=subprocess.STDOUT)
 with open(D/'runtime.txt','a') as f:f.write('Server PID: '+str(server.pid)+'\n')
 worker=threading.Thread(target=watch,daemon=True);worker.start()
 for i in range(80):
  safe()
  try:get('/system_stats');break
  except Exception:time.sleep(2)
 else:raise RuntimeError('server startup timeout')
 for p,n in [(0,0),(0,1),(1,0),(1,1)]:
  safe();name=f'P{p}N{n}'; previous=D.parent/'batch13-prompt-ablation'; q=json.load(open(previous/(name+'.json' if name=='P0N0' else name+'-prepared.json')))
  (D/(name+'.json')).write_text(json.dumps(q,indent=2));pid=post('/prompt',q)['prompt_id'];print('START',name,pid,flush=True)
  while True:
   time.sleep(2);safe();h=get('/history/'+pid)
   if pid in h:
    h=h[pid];(D/(name+'-history.json')).write_text(json.dumps(h,indent=2));
    if h['status']['status_str']!='success':raise RuntimeError('failed '+str(h['status']))
    break
  files=sorted((TMP/'output').glob('batch13-'+name+'_*.png'))
  if len(files)!=49:raise RuntimeError('expected 49 PNG frames, got '+str(len(files)))
  subprocess.run(['ffmpeg','-v','error','-y','-framerate','16','-pattern_type','glob','-i',str(TMP/'output'/('batch13-'+name+'_*.png')),'-c:v','libx264','-crf','20','-pix_fmt','yuv420p',str(D/(name+'.mp4'))],check=True)
  from PIL import Image
  grid=Image.new('RGB',(1120,672));sheet=Image.new('RGB',(1920,1152))
  for i,f in enumerate(files):
   im=Image.open(f).convert('RGB');grid.paste(im.resize((160,96)),((i%7)*160,(i//7)*96))
  for j,i in enumerate([0,6,12,18,24,30,36,42,48]):sheet.paste(Image.open(files[i]).convert('RGB'),((j%3)*640,(j//3)*384))
  grid.save(D/(name+'-all-frames.jpg'),quality=90);sheet.save(D/(name+'-samples.jpg'),quality=90);safe();print('DONE',name,flush=True)
finally:
 stop.set()
 if server and server.poll() is None:
  server.terminate()
  try:server.wait(timeout=15)
  except subprocess.TimeoutExpired:server.kill();server.wait()
 if server:
  worker.join(timeout=6)
  with open(D/'runtime.txt','a') as f:f.write(f'Server exit: {server.poll()}\nGuard: {reason}\n')
 print('CLEANUP',server.poll() if server else 'not started',reason,flush=True)

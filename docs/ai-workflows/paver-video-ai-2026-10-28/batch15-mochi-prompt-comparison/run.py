import json,time,subprocess,urllib.request,pathlib,threading,tempfile,os
D=pathlib.Path(__file__).resolve().parent
TMP=pathlib.Path(tempfile.mkdtemp(prefix='oju-batch15-',dir='/tmp/opencode'));PORT=18415; URL=f'http://127.0.0.1:{PORT}'
server=None;stop=threading.Event();failed=threading.Event();reason=[]
def check(threshold,own=None):
 mem=int(next(x.split()[1] for x in open('/proc/meminfo') if x.startswith('MemAvailable:')))
 out=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,process_name','--format=csv,noheader'],text=True,timeout=5)
 foreign=[]
 for row in out.strip().splitlines():
  if not row.strip():continue
  pid,name=[x.strip() for x in row.split(',',1)];pid=int(pid)
  if (pid==94107 and name=='/usr/libexec/gnome-remote-desktop-daemon') or pid==own:continue
  foreign.append(row)
 with open(D/'guard.log','a') as f:f.write(f'{time.time()} mem_kib={mem} compute={out.strip()!r} foreign={foreign!r}\n')
 if mem<=threshold*1024*1024 or foreign:raise RuntimeError(f'unsafe mem_kib={mem} foreign={foreign}')
def watch():
 while not stop.wait(4):
  try:check(40,server.pid)
  except Exception as e:
   reason.append(str(e));failed.set()
   if server.poll() is None:server.terminate()
   return
def safe():
 if failed.is_set():raise RuntimeError('guard: '+str(reason))
 if server.poll() is not None:raise RuntimeError('server exited')
def get(path):return json.load(urllib.request.urlopen(URL+path,timeout=8))
def post(path,obj):return json.load(urllib.request.urlopen(urllib.request.Request(URL+path,data=json.dumps(obj).encode(),headers={'Content-Type':'application/json'}),timeout=10))
for sub in ('input','output','temp','user'):(TMP/sub).mkdir()
(TMP/'models.yaml').write_text('mochi:\n  base_path: /tmp/opencode/oju-paver-mochi-Wfsd9m/models\n  diffusion_models: diffusion_models\n  text_encoders: text_encoders\n  vae: vae\n')
(D/'runtime.txt').write_text('Temporary base: '+str(TMP)+'\n')
try:
 check(75)
 log=open(TMP/'server.log','w')
 env=os.environ.copy();env.update({'OMP_NUM_THREADS':'2','OPENBLAS_NUM_THREADS':'2','MKL_NUM_THREADS':'2','COMFYUI_DISABLE_PRODUCT_TIPS':'1'})
 server=subprocess.Popen(['/home/ksi/ComfyUI/.venv/bin/python','/home/ksi/ComfyUI/main.py','--base-directory',str(TMP),'--extra-model-paths-config',str(TMP/'models.yaml'),'--listen','127.0.0.1','--port',str(PORT),'--disable-all-custom-nodes','--disable-api-nodes','--offline','--disable-assets','--vram-headroom','24'],stdout=log,stderr=subprocess.STDOUT,env=env)
 with open(D/'runtime.txt','a') as f:f.write('Server PID: '+str(server.pid)+'\n')
 worker=threading.Thread(target=watch,daemon=True);worker.start()
 for i in range(90):
  safe()
  try:get('/system_stats');break
  except Exception:time.sleep(2)
 else:raise RuntimeError('startup timeout')
 for name in ('M0','M1'):
  safe();q=json.load(open(D/(name+'-planned.json')));(D/(name+'.json')).write_text(json.dumps(q,indent=2));pid=post('/prompt',q)['prompt_id'];print('START',name,pid,flush=True)
  while True:
   time.sleep(2);safe();h=get('/history/'+pid)
   if pid in h:
    h=h[pid];(D/(name+'-history.json')).write_text(json.dumps(h,indent=2))
    if h['status']['status_str']!='success':raise RuntimeError('execution failed: '+str(h['status']))
    break
  files=sorted((TMP/'output').glob('batch15-'+name+'_*.png'))
  if len(files)!=49:raise RuntimeError('expected 49 frames got '+str(len(files)))
  subprocess.run(['ffmpeg','-v','error','-y','-framerate','24','-pattern_type','glob','-i',str(TMP/'output'/('batch15-'+name+'_*.png')),'-c:v','libx264','-crf','19','-pix_fmt','yuv420p',str(D/(name+'.mp4'))],check=True)
  from PIL import Image
  grid=Image.new('RGB',(7*212,7*120));sheet=Image.new('RGB',(3*848,3*480))
  for i,f in enumerate(files):grid.paste(Image.open(f).convert('RGB').resize((212,120)),((i%7)*212,(i//7)*120))
  for j,i in enumerate([0,6,12,18,24,30,36,42,48]):sheet.paste(Image.open(files[i]).convert('RGB'),((j%3)*848,(j//3)*480))
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

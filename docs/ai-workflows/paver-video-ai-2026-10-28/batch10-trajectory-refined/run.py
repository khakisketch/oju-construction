import importlib.util, json, pathlib, time, subprocess, os, socket, urllib.error
R=pathlib.Path(__file__).parent
spec=importlib.util.spec_from_file_location('safety','/tmp/opencode/oju-paver-mochi-Wfsd9m/run_mochi.py'); s=importlib.util.module_from_spec(spec); spec.loader.exec_module(s)
def graph(case):
 tracks=[]
 # Reference-5 resized proportionally to 640x400; moving points inside a single block, others outside.
 for x,y in [(345,224),(365,217),(385,210),(350,237),(370,230),(390,223)]:
  tracks.append([{'x':x,'y':round(y+case* (i/48)**2,3)} for i in range(49)])
 for x,y in [(65,230),(180,160),(295,140),(495,140),(570,220),(500,300),(300,320),(90,300)]:
  tracks.append([{'x':x,'y':y} for _ in range(49)])
 def N(t,**k):return {'class_type':t,'inputs':k}
 g={'1':N('UNETLoader',unet_name='WanMove.safetensors',weight_dtype='default'), '2':N('CLIPLoader',clip_name='umt5_xxl_fp8_e4m3fn_scaled.safetensors',type='wan',device='default'), '3':N('VAELoader',vae_name='wan_2.1_vae.safetensors'),'4':N('CLIPVisionLoader',clip_name='clip_vision_h.safetensors'),'5':N('LoadImage',image='start.png'),'6':N('CLIPVisionEncode',clip_vision=['4',0],image=['5',0],crop='center'),'7':N('CLIPTextEncode',clip=['2',0],text='Fixed tripod view of a real gray concrete paving block sidewalk. One central rectangular paving block gradually settles downward a little. The block stays rigid and straight; adjacent blocks and camera stay still. Natural overcast daylight, no people or tools.'),'8':N('CLIPTextEncode',clip=['2',0],text='camera movement, wobble, melting, warping, bending, hole, floating, lifting, objects appearing, cartoon, text'),'9':N('WanMoveTracksFromCoords',track_coords=json.dumps(tracks)),'10':N('WanMoveTrackToVideo',positive=['7',0],negative=['8',0],vae=['3',0],tracks=['9',0],strength=1.0,width=640,height=400,length=49,batch_size=1,start_image=['5',0],clip_vision_output=['6',0]),'11':N('ModelSamplingSD3',model=['1',0],shift=8.0),'12':N('KSampler',model=['11',0],positive=['10',0],negative=['10',1],latent_image=['10',2],seed=2026102941,steps=20,cfg=5.0,sampler_name='uni_pc',scheduler='simple',denoise=1.0),'13':N('VAEDecode',samples=['12',0],vae=['3',0]),'28':N('SaveImage',images=['13',0],filename_prefix='move-'+str(case))}
 return {'client_id':'oju-trajectory','prompt':g}
def main():
 initial=s.compute_processes(); foreign=[v for v in initial if not v[1].endswith('gnome-remote-desktop-daemon')]
 if foreign or s.available_mib()<s.MIN_START_MIB: raise RuntimeError(f'preflight refused {foreign} available {s.available_mib()}')
 baseline={p for p,n in initial}
 with socket.socket() as z:z.bind(('127.0.0.1',0));port=z.getsockname()[1]
 base=f'http://127.0.0.1:{port}'
 for d in ['output','temp','user']:(R/d).mkdir(exist_ok=True)
 args=['nice','-n','15','ionice','-c','3','/home/ksi/ComfyUI/.venv/bin/python','/home/ksi/ComfyUI/main.py','--listen','127.0.0.1','--port',str(port),'--base-directory',str(R),'--models-directory',str(R/'models'),'--disable-auto-launch','--offline','--disable-all-custom-nodes','--disable-assets','--vram-headroom','24']
 env=os.environ.copy();env.update(OMP_NUM_THREADS='2',OPENBLAS_NUM_THREADS='2',MKL_NUM_THREADS='2',COMFYUI_DISABLE_PRODUCT_TIPS='1')
 with (R/'server.log').open('x') as f:
  p=subprocess.Popen(args,cwd='/home/ksi/ComfyUI',env=env,stdout=f,stderr=subprocess.STDOUT); print('owned server',p.pid,'port',port,'baseline',initial,flush=True)
  try:
   deadline=time.monotonic()+120
   while 1:
    if p.poll() is not None or time.monotonic()>deadline:raise RuntimeError('startup failed')
    s.safety_check(p.pid,baseline)
    try:
     s.get_json(base+'/system_stats',timeout=2)
     ls=subprocess.run(['ss','-H','-lntp','sport','=',f':{port}'],capture_output=True,text=True,check=True).stdout
     if f'pid={p.pid},' not in ls:raise RuntimeError('port ownership mismatch')
     break
    except (urllib.error.URLError,TimeoutError):time.sleep(2)
   for case in [8,16]:
    mem=s.safety_check(p.pid,baseline)
    if mem<s.MIN_START_MIB:raise RuntimeError('low preflight memory')
    data=graph(case); (R/f'case-{case}.json').write_text(json.dumps(data,indent=2))
    x=s.get_json(base+'/prompt',data=json.dumps(data).encode(),timeout=10); pid=x['prompt_id']; start=time.monotonic(); print('case',case,pid,flush=True)
    while 1:
     if p.poll() is not None:raise RuntimeError('server exited')
     mem=min(mem,s.safety_check(p.pid,baseline))
     if time.monotonic()-start>1200:raise RuntimeError('timeout')
     h=s.get_json(base+'/history/'+pid)
     if pid in h:
      result=h[pid]; (R/f'case-{case}-history.json').write_text(json.dumps(result,indent=2)); status=result.get('status',{}).get('status_str'); images=result.get('outputs',{}).get('28',{}).get('images',[]); print('case',case,'status',status,'images',len(images),'seconds',time.monotonic()-start,'min_MiB',mem,flush=True)
      if status!='success' or len(images)!=49:raise RuntimeError('inference failed')
      break
     time.sleep(4)
  finally:
   if p.poll() is None:
    p.terminate()
    try:p.wait(timeout=20)
    except subprocess.TimeoutExpired:p.kill();p.wait(timeout=10)
   print('owned server stopped',p.returncode,flush=True)
if __name__=='__main__':main()

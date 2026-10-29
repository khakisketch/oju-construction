import numpy as np,os,subprocess,json
from PIL import Image
D=os.path.dirname(__file__); out={}
for name,ref,cx,cy,rx,ry,dy in [('surface','reference-4.png',300,180,128,76,20),('section','reference-9.png',225,108,110,48,14)]:
 a=np.asarray(Image.open(D+'/input/'+ref).convert('RGB').resize((640,384),Image.Resampling.LANCZOS)); h,w=a.shape[:2];Y,X=np.mgrid[0:h,0:w]; rr=((X-cx)/rx)**2+((Y-cy)/ry)**2; weight=np.where(rr<1,(1-rr)**2,0); changed=weight>0
 frames=[];masks=[]
 for i in range(33):
  amt=i/32; yy=np.clip(Y-dy*amt*weight,0,h-1);y0=yy.astype(int);y1=np.minimum(y0+1,h-1);t=yy-y0
  b=np.rint(a[y0,X]*(1-t[...,None])+a[y1,X]*t[...,None]).clip(0,255).astype('uint8'); frames.append(b)
  mask=np.where(changed,255,0).astype('uint8');masks.append(np.repeat(mask[...,None],3,2))
 os.makedirs(D+'/controls/'+name,exist_ok=True)
 for i,frame in enumerate(frames): Image.fromarray(frame).save(D+f'/controls/{name}/frame_{i:03d}.png')
 Image.fromarray(frames[0]).save(D+'/controls/'+name+'-start.png');Image.fromarray(frames[-1]).save(D+'/controls/'+name+'-end.png')
 def vid(arr,path):
  p=subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','640x384','-framerate','16','-i','-','-an','-c:v','libx264rgb','-crf','0',path],stdin=subprocess.PIPE)
  for frame in arr:p.stdin.write(frame.tobytes())
  p.stdin.close();assert p.wait()==0
 vid(frames,D+'/input/'+name+'-moving.mp4');vid(masks,D+'/input/'+name+'-mask.mp4')
 if name=='surface':
  sparse=[frames[0] if i<4 else frames[-1] if i>=29 else np.full_like(a,128) for i in range(33)]; sparse_masks=[np.full_like(a,0 if i<4 or i>=29 else 255) for i in range(33)]
  vid(sparse,D+'/input/surface-sparse.mp4');vid(sparse_masks,D+'/input/surface-sparse-mask.mp4')
 delta=np.any(frames[0]!=frames[-1],axis=2);out[name]={'center':[cx,cy],'radius':[rx,ry],'max_shift_px':dy,'changed_pixels':int(delta.sum()),'outside_ellipse_changed':int(np.logical_and(delta,~changed).sum()),'start_end_mean_abs_rgb':float(np.abs(frames[0].astype('int16')-frames[-1].astype('int16')).mean())}
print(json.dumps(out,indent=2));json.dump(out,open(D+'/controls/measurements.json','w'),indent=2)

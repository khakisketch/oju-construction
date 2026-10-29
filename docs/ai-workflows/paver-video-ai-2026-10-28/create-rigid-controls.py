import os,subprocess,json,numpy as np
from PIL import Image,ImageDraw,ImageFilter
D=os.path.dirname(__file__);W,H=640,384
src=Image.open(D+'/input/surface-start.png').convert('RGB');a=np.array(src);poly=[(326,119),(460,119),(478,204),(326,204)];s=3
m=Image.new('L',(W,H),0);ImageDraw.Draw(m).polygon(poly,fill=255);patchmask=m.filter(ImageFilter.GaussianBlur(0.35));motion=[];regions=[]
for i in range(33):
 dy=round(5*i/32,3);shift=m.transform((W,H),Image.Transform.AFFINE,(1,0,0,0,1,-dy),resample=Image.Resampling.BILINEAR);mask=patchmask.transform((W,H),Image.Transform.AFFINE,(1,0,0,0,1,-dy),resample=Image.Resampling.BILINEAR)
 exposed=np.maximum(np.array(m,dtype=np.int16)-np.array(shift,dtype=np.int16),0).astype('uint8'); base=src.copy();base.paste((39,39,37),(0,0,W,H),Image.fromarray(exposed));moved=src.transform((W,H),Image.Transform.AFFINE,(1,0,0,0,1,-dy),resample=Image.Resampling.BILINEAR);base.paste(moved,(0,0),mask);motion.append(np.array(base));
 u=np.maximum(np.array(m),np.array(shift));react=Image.fromarray(u).filter(ImageFilter.MaxFilter(29));regions.append(np.repeat(np.array(react)[:,:,None],3,axis=2))
Image.fromarray(motion[0]).save(D+'/controls/rigid-start.png');Image.fromarray(motion[16]).save(D+'/controls/rigid-middle.png');Image.fromarray(motion[-1]).save(D+'/controls/rigid-end.png');m.save(D+'/controls/paver-polygon.png');Image.fromarray(regions[-1]).save(D+'/controls/reactive-mask.png')
def vid(frames,path):
 p=subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','640x384','-framerate','16','-i','-','-c:v','libx264rgb','-crf','0',path],stdin=subprocess.PIPE)
 for f in frames:p.stdin.write(f.tobytes())
 p.stdin.close();assert p.wait()==0
vid(motion,D+'/input/rigid-moving.mp4');vid(regions,D+'/input/rigid-mask.mp4');sparse=[motion[0] if i<4 else motion[-1] if i>=29 else np.full_like(a,128) for i in range(33)]; sm=[np.zeros_like(a) if i<4 or i>=29 else np.full_like(a,255) for i in range(33)];vid(sparse,D+'/input/rigid-sparse.mp4');vid(sm,D+'/input/rigid-sparse-mask.mp4')
d=np.any(motion[0]!=motion[-1],axis=2);r=np.array(Image.fromarray(regions[-1][:,:,0]));res={'polygon_xy':poly,'translation_xy':[0,5],'changed_pixels':int(d.sum()),'outside_reactive_changed':int(np.logical_and(d,r==0).sum()),'start_equals_input':bool(np.array_equal(motion[0],a)),'note':'handmade rough raster patch translating vertically, not physical motion'};json.dump(res,open(D+'/controls/measurements.json','w'),indent=2);print(res)

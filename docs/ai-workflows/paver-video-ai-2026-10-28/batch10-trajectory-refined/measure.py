from PIL import Image
from pathlib import Path
import numpy as np,json
r=Path(__file__).parent
# Brute SSD translation: signed (dx,dy) from frame 0 patch to frame 48; photometric error means unreliable on morphing.
def measure(a,b,box):
 x0,y0,x1,y1=box; p=a[y0:y1,x0:x1]; vals=[]
 for dy in range(-25,26):
  for dx in range(-25,26):
   q=b[y0+dy:y1+dy,x0+dx:x1+dx]; vals.append((float(np.mean((p-q)**2)),dx,dy))
 vals.sort(); base=float(np.mean((p-b[y0:y1,x0:x1])**2)); return {'best_mse':round(vals[0][0],2),'zero_mse':round(base,2),'best_dx':vals[0][1],'best_dy':vals[0][2],'box':box}
out={}
for c in [8,16]:
 def f(n):return np.asarray(Image.open(r/f'review/{c}-frame-{n:02}.png').convert('L'),dtype=np.float32)
 a,b=f(0),f(48)
 out[c]={'moving_region':measure(a,b,[345,208,395,238]),'stationary_background':measure(a,b,[40,170,90,210])}
print(json.dumps(out,indent=2));(r/'measure.json').write_text(json.dumps(out,indent=2)+'\n')

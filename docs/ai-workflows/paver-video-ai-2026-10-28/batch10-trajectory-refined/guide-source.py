from PIL import Image, ImageDraw
im=Image.open('start.png').resize((640,400)); d=ImageDraw.Draw(im)
for x,y in [(345,224),(365,217),(385,210),(350,237),(370,230),(390,223)]:
 d.ellipse((x-3,y-3,x+3,y+3),fill='red'); d.line((x,y,x,y+16),fill='red',width=2)
for x,y in [(65,230),(180,160),(295,140),(495,140),(570,220),(500,300),(300,320),(90,300)]:
 d.ellipse((x-3,y-3,x+3,y+3),fill='cyan')
im.save('guide-recreated.png')

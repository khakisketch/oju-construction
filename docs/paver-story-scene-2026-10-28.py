"""Paver settlement cross-section diorama — Blender 4.0.2, Cycles, background render.
Usage: blender -b --factory-startup -P docs/paver-story-scene-2026-10-28.py [-- --test 46]
Frames 0..60, 24fps. Camera fixed near-frontal. No text objects (labels are HTML).
Denoising OFF (distro has no OIDN).
Output: $PAVER_OUT_DIR (default: this script's directory)/frames/frame_####.png,
test stills to $PAVER_OUT_DIR/test_frame<N>.png.
Choose a new empty PAVER_OUT_DIR: rendering may overwrite files with the same names.
Encode: ffmpeg -n -framerate 24 -i "$PAVER_OUT_DIR/frames/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 23 -movflags +faststart "$PAVER_OUT_DIR/paver-story-settlement.mp4"
Poster: ffmpeg -n -i "$PAVER_OUT_DIR/frames/frame_0046.png" -q:v 3 "$PAVER_OUT_DIR/paver-story-poster.jpg"
"""
import bpy, math, sys, os

TEST = "--test" in sys.argv
FRAMES = 61
W, H = 960, 540
SAMPLES = 64

# ---------- setup ----------
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = False
try:
    bpy.context.view_layer.cycles.use_denoising = False
except Exception as e:
    print("denoise view_layer flag:", e)
scene.cycles.device = "CPU"
scene.render.resolution_x, scene.render.resolution_y = W, H
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.frame_start, scene.frame_end = 0, FRAMES - 1
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"

world = bpy.data.worlds["World"]
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.055, 0.10, 0.19, 1.0)
bg.inputs["Strength"].default_value = 1.0

# lights
sun = bpy.data.objects.new("Sun", bpy.data.lights.new("Sun", "SUN"))
sun.data.energy = 3.2
sun.rotation_euler = (math.radians(48), math.radians(8), math.radians(-32))
bpy.context.collection.objects.link(sun)
fill = bpy.data.objects.new("Fill", bpy.data.lights.new("Fill", "AREA"))
fill.data.energy = 60.0
fill.data.size = 6.0
fill.location = (-6, -8, 6)
bpy.context.collection.objects.link(fill)

# ---------- material helpers ----------
def principled(name, base=(0.8, 0.8, 0.8, 1), rough=0.8, metallic=0.0, extra=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = base
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metallic
    if extra:
        extra(m)
    return m

def add_noise_bump(m, scale=4.0, detail=3.0, strength=0.35):
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexCoord")
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = scale
    noise.inputs["Detail"].default_value = detail
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    nt.links.new(tex.outputs["Object"], noise.inputs["Vector"])
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

soil_m = principled("Soil", (0.23, 0.16, 0.11, 1), 0.95)
add_noise_bump(soil_m, 6.0, 4.0, 0.6)
gravel_m = principled("Gravel", (0.45, 0.42, 0.38, 1), 0.9)
add_noise_bump(gravel_m, 14.0, 2.0, 0.5)
sand_m = principled("Sand", (0.72, 0.63, 0.47, 1), 0.9)
add_noise_bump(sand_m, 20.0, 2.0, 0.2)
paver_mats = []
for i, c in enumerate([(0.62, 0.63, 0.64), (0.58, 0.59, 0.60), (0.64, 0.64, 0.65)]):
    m = principled(f"Paver{i}", (*c, 1), 0.75)
    add_noise_bump(m, 9.0, 3.0, 0.15)
    paver_mats.append(m)
conc_m = principled("Concrete", (0.55, 0.58, 0.60, 1), 0.8)
add_noise_bump(conc_m, 8.0, 3.0, 0.2)
pipe_m = principled("Pipe", (0.75, 0.78, 0.80, 1), 0.45)
dark_m = principled("Dark", (0.03, 0.025, 0.02, 1), 1.0)
stage_m = principled("Stage", (0.10, 0.14, 0.22, 1), 0.9)

def box(name, loc, dims, mat, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.name = name
    o.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        o.data.materials.append(mat)
    if bevel > 0:
        mod = o.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    return o

def key(o, frame, loc=None, rot=None, scale=None):
    bpy.context.scene.frame_set(frame)
    if loc is not None:
        o.location = loc
    if rot is not None:
        o.rotation_euler = rot
    if scale is not None:
        o.scale = scale
    if loc is not None:
        o.keyframe_insert("location", frame=frame)
    if rot is not None:
        o.keyframe_insert("rotation_euler", frame=frame)
    if scale is not None:
        o.keyframe_insert("scale", frame=frame)

def key_alpha(mat, frame, alpha):
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bpy.context.scene.frame_set(frame)
    bsdf.inputs["Alpha"].default_value = alpha
    try:
        bsdf.inputs["Alpha"].keyframe_insert("default_value", frame=frame)
    except TypeError:
        pass

# ---------- stage base ----------
box("Stage", (0, 0, -0.35), (13.5, 5.5, 0.5), stage_m)

# ---------- layers (x -5.2..5.2, depth y -1.5..1.5) ----------
soil = box("Soil", (0, 0, 1.0), (10.4, 3.0, 2.0), soil_m)
gravel = box("Gravel", (0, 0, 2.4), (10.4, 3.0, 0.8), gravel_m)
sand = box("Sand", (0, 0, 2.95), (10.4, 3.0, 0.3), sand_m)

# scattered stones in gravel front for natural read
import random
random.seed(11)
stone_m = principled("Stone", (0.5, 0.47, 0.42, 1), 0.95)
for i in range(90):
    x = random.uniform(-5.1, 5.1)
    z = random.uniform(2.08, 2.72)
    s = random.uniform(0.05, 0.11)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=s, location=(x, -1.52, z))
    st = bpy.context.active_object
    st.name = f"Stone{i}"
    st.data.materials.append(stone_m)

# ---------- pavers: 6, x0=-4.6, w=1.233, gap .16, z 3.1..3.65 ----------
PXS = [-4.6 + i * (1.233 + 0.16) for i in range(6)]
# (paver construction continues)
PW = 1.233
pavers = []
for i, x in enumerate(PXS):
    p = box(f"Paver{i}", (x + PW / 2, 0, 3.375), (PW, 3.0, 0.55), paver_mats[i % 3], bevel=0.03)
    pavers.append(p)

SETTLE = {1: (-0.42, 0.08), 2: (-0.42, -0.08), 0: (-0.07, 0.0), 3: (-0.07, 0.0)}
for i in range(6):
    dz, ry = SETTLE.get(i, (0.0, 0.0))
    key(pavers[i], 0, loc=(PXS[i] + PW / 2, 0, 3.375), rot=(0, 0, 0))
    key(pavers[i], 28, loc=(PXS[i] + PW / 2, 0, 3.375), rot=(0, 0, 0))
    key(pavers[i], 42, loc=(PXS[i] + PW / 2, 0, 3.375 + dz), rot=(0, ry, 0))
    key(pavers[i], 60, loc=(PXS[i] + PW / 2, 0, 3.375 + dz), rot=(0, ry, 0))

# ---------- pipe along Y at (4.2, z=1.0), r=0.55, gap at top-left ----------
# animated flow / water / rain materials
stream_m = bpy.data.materials.new("MigStreamM")
stream_m.use_nodes = True
sbsdf = stream_m.node_tree.nodes["Principled BSDF"]
sbsdf.inputs["Base Color"].default_value = (0.20, 0.34, 0.48, 1)
sbsdf.inputs["Roughness"].default_value = 0.25
sbsdf.inputs["Alpha"].default_value = 0.0
swave = stream_m.node_tree.nodes.new("ShaderNodeTexWave")
swave.wave_type = "BANDS"
swave.inputs["Scale"].default_value = 6.0
smap = stream_m.node_tree.new("ShaderNodeMapping") if False else stream_m.node_tree.nodes.new("ShaderNodeMapping")
smap.name = "MigMap"
stex = stream_m.node_tree.nodes.new("ShaderNodeTexCoord")
stream_m.node_tree.links.new(stex.outputs["UV"], smap.inputs["Vector"])
stream_m.node_tree.links.new(smap.outputs["Vector"], swave.inputs["Vector"])
smix = stream_m.node_tree.nodes.new("ShaderNodeMixRGB")
smix.inputs["Color1"].default_value = (0.20, 0.34, 0.48, 1)
smix.inputs["Color2"].default_value = (0.55, 0.68, 0.75, 1)
stream_m.node_tree.links.new(swave.outputs["Color"], smix.inputs["Fac"])
stream_m.node_tree.links.new(smix.outputs["Color"], sbsdf.inputs["Base Color"])

water_m = bpy.data.materials.new("PondM")
water_m.use_nodes = True
wbsdf = water_m.node_tree.nodes["Principled BSDF"]
wbsdf.inputs["Base Color"].default_value = (0.62, 0.72, 0.75, 1)
wbsdf.inputs["Roughness"].default_value = 0.3
wem = water_m.node_tree.nodes.new("ShaderNodeEmission")
wem.inputs["Color"].default_value = (0.45, 0.55, 0.58, 1)
wem.inputs["Strength"].default_value = 0.35
wmix = water_m.node_tree.nodes.new("ShaderNodeMixShader")
wmix.inputs["Fac"].default_value = 0.35
wout = water_m.node_tree.nodes["Material Output"]
water_m.node_tree.links.new(wbsdf.outputs["BSDF"], wmix.inputs[1])
water_m.node_tree.links.new(wem.outputs["Emission"], wmix.inputs[2])
water_m.node_tree.links.new(wmix.outputs["Shader"], wout.inputs["Surface"])
wbsdf.inputs["Metallic"].default_value = 0.0

rain_m = bpy.data.materials.new("RainM")
rain_m.use_nodes = True
rbsdf = rain_m.node_tree.nodes["Principled BSDF"]
rbsdf.inputs["Base Color"].default_value = (0.75, 0.85, 0.9, 1)
rbsdf.inputs["Alpha"].default_value = 0.0
rmul = rain_m.node_tree.nodes.new("ShaderNodeMath")
rmul.operation = "MULTIPLY"
rmul.inputs[1].default_value = 0.38
rt = rain_m.node_tree.nodes.new("ShaderNodeTexCoord")
rw = rain_m.node_tree.nodes.new("ShaderNodeTexWave")
rw.wave_type = "BANDS"
rw.bands_direction = "Y"
rw.inputs["Scale"].default_value = 120.0
rm = rain_m.node_tree.nodes.new("ShaderNodeMapping")
rm.inputs["Scale"].default_value = (1.0, 3.0, 1.0)
rain_m.node_tree.links.new(rt.outputs["UV"], rm.inputs["Vector"])
rain_m.node_tree.links.new(rm.outputs["Vector"], rw.inputs["Vector"])
rain_m.node_tree.links.new(rw.outputs["Color"], rmul.inputs[0])
rain_m.node_tree.links.new(rmul.outputs["Value"], rbsdf.inputs["Alpha"])
bpy.ops.mesh.primitive_cylinder_add(radius=0.55, depth=3.2, location=(3.2, 0, 1.0))
pipe = bpy.context.active_object
pipe.name = "Pipe"
pipe.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
pipe.data.materials.append(pipe_m)
# inner dark disc at front mouth (faces camera, -Y): thin capped cylinder
bpy.ops.mesh.primitive_cylinder_add(radius=0.44, depth=0.04, location=(3.2, -1.60, 1.0))
mouth = bpy.context.active_object
mouth.name = "PipeMouth"
mouth.rotation_euler = (math.radians(90), 0, 0)
mouth.data.materials.append(dark_m)
# gap collar: two arc segments (torus-like) leaving opening at top-left of front ring
def arc_ring(name, a0, a1, tube=0.09, R=0.55):
    bpy.ops.curve.primitive_bezier_circle_add(radius=R, location=(3.2, -1.61, 1.0))
    cu = bpy.context.active_object
    cu.name = name
    cu.data.dimensions = "3D"
    cu.data.bevel_depth = tube
    cu.data.bevel_resolution = 2
    spl = cu.data.splines[0]
    spl.use_cyclic_u = False
    # bezier circle has 4 points; set handle range by trimming: use bevel factors
    u0, u1 = a0 / (2 * math.pi), a1 / (2 * math.pi)
    cu.data.bevel_factor_start = u0
    cu.data.bevel_factor_end = u1
    cu.rotation_euler = (math.radians(90), 0, 0)
    cu.data.materials.append(pipe_m)
    return cu
# full circle angles: 0=east, CCW seen from -Y (front). Gap centered ~135deg (top-left).
arc_ring("PipeRingA", math.radians(-40), math.radians(115))
arc_ring("PipeRingB", math.radians(155), math.radians(320))
# orange-ish rim ticks at gap edges
rim_m = principled("Rim", (0.85, 0.45, 0.15, 1), 0.6)
for ang in (115, 155):
    a = math.radians(ang)
    gx = 3.2 + 0.55 * math.cos(a)
    gz = 1.0 + 0.55 * math.sin(a)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.075, location=(gx, -1.61, gz))
    rim = bpy.context.active_object
    rim.name = f"Rim{ang}"
    rim.data.materials.append(rim_m)

# ---------- (surface inlet removed: the buried damaged pipe below is the
# ---------- conditional example on its own; no unconnected shaft is drawn) ----------

# ---------- migration stream: tube along path (joint -> pipe gap) ----------
def mig_point(q):
    x0, z0 = -2.0, 2.95
    cx, cz = 0.6, 2.1
    x1, z1 = 2.80, 1.50
    u = 1 - q
    return (u * u * x0 + 2 * u * q * cx + q * q * x1,
            u * u * z0 + 2 * u * q * cz + q * q * z1)

curve_data = bpy.data.curves.new("MigCurve", type="CURVE")
curve_data.dimensions = "3D"
curve_data.bevel_depth = 0.032
curve_data.bevel_resolution = 2
spl = curve_data.splines.new("BEZIER")
spl.bezier_points.add(7)
pts = [mig_point(q / 7) for q in range(8)]
for bp, (x, z) in zip(spl.bezier_points, pts):
    bp.co = (x, -1.53, z)
    bp.handle_left_type = bp.handle_right_type = "AUTO"
stream_obj = bpy.data.objects.new("MigStream", curve_data)
bpy.context.collection.objects.link(stream_obj)
stream_obj.data.materials.append(stream_m)
key_alpha(stream_m, 0, 0.0)
key_alpha(stream_m, 8, 0.0)
key_alpha(stream_m, 14, 0.9)
key_alpha(stream_m, 30, 0.9)
key_alpha(stream_m, 36, 0.0)
key_alpha(stream_m, 60, 0.0)
# scroll the stripes
mp = stream_m.node_tree.nodes["MigMap"]
mp.inputs["Location"].default_value = (0, 0, 0)
mp.keyframe_insert('inputs["Location"]', frame=0) if False else None
mp.inputs["Location"].keyframe_insert("default_value", frame=8)
mp.inputs["Location"].default_value = (-2.5, 0, 0)
mp.inputs["Location"].keyframe_insert("default_value", frame=30)

# grains riding the path
grain_m = principled("Grain", (0.55, 0.42, 0.28, 1), 0.9)
grains = []
for gi in range(12):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(mig_point(0)[0], -1.56, mig_point(0)[1]))
    g = bpy.context.active_object
    g.name = f"Grain{gi}"
    g.data.materials.append(grain_m)
    grains.append(g)
    off = gi / 12.0
    g.scale = (0.01, 0.01, 0.01)
    g.keyframe_insert("scale", frame=8)
    for k, f in enumerate([10, 15, 20, 25, 30]):
        q = min(1.0, max(0.0, (k / 4.0) * 1.15 - off * 0.15 + 0.0))
        # stagger departures
        q = min(1.0, max(0.0, ((f - 8) / 22.0) * (1.0 + off * 0.1) - off * 0.12))
        x, z = mig_point(q)
        key(g, f, loc=(x, -1.56, z), scale=(1, 1, 1) if 0 < q < 0.99 else (0.01, 0.01, 0.01))
    g.scale = (0.01, 0.01, 0.01)
    g.keyframe_insert("scale", frame=33)

# ---------- cavity (dark void under bedding, grows 14..34) ----------
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0, location=(-1.9, -1.5, 2.5))
cav = bpy.context.active_object
cav.name = "Cavity"
cav_m = principled("Cavity", (0.10, 0.07, 0.05, 1), 1.0)
add_noise_bump(cav_m, 8.0, 3.0, 0.5)
cav.data.materials.append(cav_m)
key(cav, 0, scale=(0.01, 0.01, 0.01))
key(cav, 14, scale=(0.01, 0.01, 0.01))
key(cav, 34, scale=(1.0, 0.13, 0.36))
key(cav, 42, scale=(1.0, 0.13, 0.36))
key(cav, 52, scale=(0.85, 0.11, 0.30))
key(cav, 60, scale=(0.85, 0.11, 0.30))
# fallen crumbs on the cavity rim (scale with the void's later phase)
random.seed(23)
for ci in range(8):
    cxr = -2.6 + ci * 0.2 + random.uniform(-0.05, 0.05)
    czr = 2.72 + random.uniform(-0.04, 0.06)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(0.05, 0.09), location=(cxr, -1.58, czr))
    cr = bpy.context.active_object
    cr.name = f"Crumb{ci}"
    cr.data.materials.append(cav_m)
    key(cr, 0, scale=(0.01, 0.01, 0.01))
    key(cr, 20, scale=(0.01, 0.01, 0.01))
    key(cr, 34, scale=(1, 1, 1))
    key(cr, 60, scale=(1, 1, 1))

# ---------- pond (thin capped disc so it has real faces) ----------
bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=0.03, location=(-1.95, -0.7, 3.25))
pond = bpy.context.active_object
pond.name = "Pond"
pond.scale = (0.01, 0.01, 0.01)
pond.data.materials.append(water_m)
pond.keyframe_insert("scale", frame=0)
key(pond, 34, scale=(0.01, 0.01, 0.01))
key(pond, 48, scale=(1.7, 0.85, 1.0))
key(pond, 60, scale=(1.7, 0.85, 1.0))

# ---------- rain sheet + joint trickles + runoff (0..22) ----------
rain = box("Rain", (0, -1.75, 5.2), (11.0, 0.01, 4.2), rain_m)
def key_rain(frame, v):
    bpy.context.scene.frame_set(frame)
    rmul.inputs[1].default_value = v
    rmul.inputs[1].keyframe_insert("default_value", frame=frame)
key_rain(0, 0.22)
key_rain(18, 0.22)
key_rain(24, 0.0)
key_rain(60, 0.0)

trick_m = principled("Trickle", (0.30, 0.50, 0.65, 1), 0.3)
trick_m.node_tree.nodes["Principled BSDF"].inputs["Alpha"].default_value = 0.75
for ti, jx in enumerate([-3.16, -1.75, 1.05]):
    tr = box(f"Trickle{ti}", (jx, 0, 2.95), (0.07, 2.6, 0.35), trick_m)
key_alpha(trick_m, 0, 0.75)
key_alpha(trick_m, 20, 0.75)
key_alpha(trick_m, 26, 0.0)
key_alpha(trick_m, 60, 0.0)

run_m = principled("Runoff", (0.25, 0.45, 0.60, 1), 0.25)
run_m.node_tree.nodes["Principled BSDF"].inputs["Alpha"].default_value = 0.7
run1 = box("RunoffL", (-3.6, 0, 3.70), (2.4, 0.5, 0.02), run_m)
run2 = box("RunoffR", (0.6, 0, 3.70), (2.6, 0.5, 0.02), run_m)
for r in (run1, run2):
    bpy.context.scene.frame_set(0)
    r.keyframe_insert("scale", frame=0)
key_alpha(run_m, 0, 0.0)
key_alpha(run_m, 6, 0.7)
key_alpha(run_m, 30, 0.7)
key_alpha(run_m, 40, 0.0)
key_alpha(run_m, 60, 0.0)

# ---------- repair zones (fade 52..60) ----------
def zone(name, loc, dims, color):
    m = bpy.data.materials.new(name + "M")
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Alpha"].default_value = 0.0
    z = box(name, loc, dims, None)
    z.data.materials.append(m)
    z.display_type = "WIRE"
    key_alpha(m, 0, 0.0)
    key_alpha(m, 51, 0.0)
    key_alpha(m, 58, 0.30)
    key_alpha(m, 60, 0.30)
    return z
zone("ZoneA", (-2.45, 0, 3.35), (3.6, 3.2, 1.2), (0.3, 0.55, 1.0))
zone("ZoneB", (-2.3, 0, 2.5), (3.4, 3.2, 1.3), (0.3, 0.8, 0.4))
zone("ZoneC", (3.2, 0, 1.0), (2.0, 3.4, 2.2), (1.0, 0.6, 0.2))

# ---------- camera (aim at mid-scene, not the soil) ----------
bpy.ops.object.empty_add(location=(-0.3, 0, 2.5))
aim = bpy.context.active_object
aim.name = "Aim"
bpy.ops.object.camera_add(location=(0.4, -13.8, 5.6))
cam = bpy.context.active_object
cam.name = "Cam"
track = cam.constraints.new("TRACK_TO")
track.target = aim
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"
cam.data.lens = 46
scene.camera = cam

# ---------- render driver ----------
OUT_DIR = os.environ.get("PAVER_OUT_DIR", os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(OUT_DIR, "frames"), exist_ok=True)
out = os.path.join(OUT_DIR, "frames", "frame_####.png")
if TEST:
    try:
        tf = int(sys.argv[sys.argv.index("--test") + 1])
    except Exception:
        tf = 30
    scene.frame_set(tf)
    if tf == 46:
        print("POND faces:", len(pond.data.polygons), "verts:", len(pond.data.vertices))
        print("POND loc:", tuple(pond.location), "scale:", tuple(pond.scale),
              "hide:", pond.hide_render, "mats:", [m.name for m in pond.data.materials])
        print("CAV scale:", tuple(cav.scale), "loc:", tuple(cav.location))
        scene.frame_set(tf)
    scene.render.filepath = os.path.join(OUT_DIR, f"test_frame{tf}.png")
    bpy.ops.render.render(write_still=True)
    print(f"WROTE test_frame{tf}.png")
else:
    scene.render.filepath = out
    bpy.ops.render.render(animation=True)
    print("WROTE animation frames")

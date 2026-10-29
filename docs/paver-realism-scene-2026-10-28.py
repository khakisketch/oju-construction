"""Realistic pavement cutaway STILLS (normal vs settled) - NEW renderer.

NOT a field photo, NOT a simulation, NOT an engineering standard.
Representative explanatory geometry, technically unreviewed.

Run with Blender 4.0 (CPU Cycles, no OIDN in this build):
  blender -b --factory-startup -P docs/paver-realism-scene-2026-10-28.py
Env:
  PAVER_OUT_DIR  required, fresh dir (e.g. /tmp/opencode/paver-realism/preview)
  PAVER_STATE    normal | settled   (default normal)
  PAVER_SAMPLES  default 64 (preview) / finals use 320
  PAVER_W/H      default 960x540 (preview) / finals 1920x1080

Same camera, lights, materials, texture sampling for both states.
Only the locally affected support/pavement + puddle differ.
No text, arrows, rain, sparkles burned into the image.
"""

import math
import os
import random
import time

import bpy
from mathutils import Matrix, Vector

T0 = time.time()

OUT = os.environ.get("PAVER_OUT_DIR")
if not OUT:
    raise RuntimeError("Set PAVER_OUT_DIR to a fresh output directory")
os.makedirs(OUT, exist_ok=True)
STATE = os.environ.get("PAVER_STATE", "normal").strip().lower()
if STATE not in ("normal", "settled"):
    raise RuntimeError("PAVER_STATE must be normal|settled, got %r" % STATE)
SETTLED = (STATE == "settled")
SAMPLES = int(os.environ.get("PAVER_SAMPLES", "64"))
RES_W = int(os.environ.get("PAVER_W", "960"))
RES_H = int(os.environ.get("PAVER_H", "540"))

R_PAVER = random.Random(1101)
R_FACE = random.Random(2202)
R_STONE = random.Random(3303)
R_FLOOR = random.Random(4404)
R_POCKET = random.Random(5505)
R_PUDDLE = random.Random(6606)

PAVER_L, PAVER_WD, PAVER_H = 0.200, 0.100, 0.060
JOINT = 0.004
PAVE_X = 7.0
PAVE_Y1 = 7.0
TOP_Z = 0.0
BED_BOT = -0.100
BASE_BOT = -0.300
FACE_BOT = -1.000
FACE_X = 6.0

DIP_CX, DIP_SX, DIP_MAX = 0.35, 0.65, 0.040
CAV_CX, CAV_CZ, CAV_RX, CAV_RZ = 0.35, -0.175, 0.27, 0.070
PIPE_X, PIPE_Z, PIPE_RO, PIPE_RI, PIPE_LEN = 0.62, -0.500, 0.110, 0.088, 2.0
PUD_CX, PUD_CY, PUD_RX, PUD_RY = 0.35, 0.75, 0.65, 0.40

TEXTURE_DIR = os.environ.get(
    "PAVER_TEXTURE_DIR",
    os.path.join(os.path.dirname(os.path.abspath(__file__)),
                 "images", "paver-hybrid"))


def dip_at(x, y):
    g = math.exp(-((x - DIP_CX) / DIP_SX) ** 2)
    if y < 0.9:
        f = 1.0
    elif y < 2.2:
        f = 1.0 - (y - 0.9) / 1.3
    else:
        f = 0.0
    return DIP_MAX * g * f


def dip_slope(x, y):
    h = 0.01
    return (dip_at(x + h, y) - dip_at(x - h, y)) / (2 * h)


for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = False
scene.cycles.diffuse_bounces = 4
scene.cycles.glossy_bounces = 4
scene.cycles.transparent_max_bounces = 8
scene.cycles.sample_clamp_indirect = 3.0
scene.render.resolution_x = RES_W
scene.render.resolution_y = RES_H
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "None"
scene.view_settings.exposure = 0.0

world = scene.world
world.use_nodes = True
wnt = world.node_tree
wnt.nodes.clear()
w_out = wnt.nodes.new("ShaderNodeOutputWorld")
w_bg = wnt.nodes.new("ShaderNodeBackground")
w_bg.inputs["Strength"].default_value = 1.05
w_noise = wnt.nodes.new("ShaderNodeTexNoise")
w_noise.inputs["Scale"].default_value = 0.5
w_noise.inputs["Detail"].default_value = 2.0
w_ramp = wnt.nodes.new("ShaderNodeValToRGB")
w_ramp.color_ramp.elements[0].position = 0.35
w_ramp.color_ramp.elements[0].color = (0.700, 0.730, 0.765, 1.0)
w_ramp.color_ramp.elements[1].position = 0.75
w_ramp.color_ramp.elements[1].color = (0.800, 0.825, 0.855, 1.0)
w_coord = wnt.nodes.new("ShaderNodeTexCoord")
wnt.links.new(w_coord.outputs["Generated"], w_noise.inputs["Vector"])
wnt.links.new(w_noise.outputs["Fac"], w_ramp.inputs["Fac"])
wnt.links.new(w_ramp.outputs["Color"], w_bg.inputs["Color"])
wnt.links.new(w_bg.outputs["Background"], w_out.inputs["Surface"])


def principled(name, base, rough=0.9, metallic=0.0, ior=1.45):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*base, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metallic
    try:
        bsdf.inputs["IOR"].default_value = ior
    except KeyError:
        pass
    return mat


def add_image(mat, filename, scale, influence,
              bump_strength=0.4, bump_distance=0.004):
    path = os.path.join(TEXTURE_DIR, filename)
    if not os.path.isfile(path):
        raise RuntimeError("Missing texture: " + path)
    nt = mat.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(path, check_existing=True)
    tex.projection = "BOX"
    tex.projection_blend = 0.35
    tex.extension = "REPEAT"
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (scale, scale, scale)
    nt.links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    nt.links.new(mapping.outputs["Vector"], tex.inputs["Vector"])
    base_sock = bsdf.inputs["Base Color"]
    mix = nt.nodes.new("ShaderNodeMix")
    mix.blend_type = "MIX"
    mix.data_type = "RGBA"
    mix.inputs["Factor"].default_value = influence
    if base_sock.is_linked:
        nt.links.new(base_sock.links[0].from_socket, mix.inputs["A"])
    else:
        mix.inputs["A"].default_value = base_sock.default_value
    nt.links.new(tex.outputs["Color"], mix.inputs["B"])
    nt.links.new(mix.outputs["Result"], base_sock)
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = bump_strength
    bump.inputs["Distance"].default_value = bump_distance
    nt.links.new(tex.outputs["Color"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def add_tone_noise(mat, scale, amount,
                   dark=(0.72, 0.72, 0.70), light=(1.06, 1.06, 1.04)):
    nt = mat.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    tex = nt.nodes.new("ShaderNodeTexNoise")
    tex.inputs["Scale"].default_value = scale
    tex.inputs["Detail"].default_value = 3.0
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.3
    ramp.color_ramp.elements[0].color = (*dark, 1.0)
    ramp.color_ramp.elements[1].position = 0.75
    ramp.color_ramp.elements[1].color = (*light, 1.0)
    coord = nt.nodes.new("ShaderNodeTexCoord")
    nt.links.new(coord.outputs["Object"], tex.inputs["Vector"])
    nt.links.new(tex.outputs["Fac"], ramp.inputs["Fac"])
    base = bsdf.inputs["Base Color"]
    mult = nt.nodes.new("ShaderNodeMixRGB")
    mult.blend_type = "MULTIPLY"
    mult.inputs[0].default_value = amount
    if base.is_linked:
        nt.links.new(base.links[0].from_socket, mult.inputs[1])
    else:
        mult.inputs[1].default_value = base.default_value
    nt.links.new(ramp.outputs["Color"], mult.inputs[2])
    nt.links.new(mult.outputs["Color"], base)
    return mat

# ---------------- materials ----------------
paver_mat = principled("Paver weathered concrete",
                       (0.360, 0.355, 0.345), rough=0.88)
add_image(paver_mat, "concrete.png", 5.0, 0.45,
          bump_strength=0.25, bump_distance=0.002)
add_tone_noise(paver_mat, 1.4, 0.55)

joint_mat = principled("Joint sand fill", (0.420, 0.400, 0.360), rough=1.0)
add_tone_noise(joint_mat, 3.0, 0.4)

bedding_mat = principled("Bedding sand", (0.470, 0.410, 0.320), rough=1.0)
add_image(bedding_mat, "sand.png", 4.0, 0.6,
          bump_strength=0.6, bump_distance=0.003)

base_mat = principled("Base aggregate", (0.475, 0.465, 0.44), rough=0.97)
add_image(base_mat, "aggregate.png", 3.0, 0.62,
          bump_strength=0.8, bump_distance=0.006)

soil_mat = principled("Subgrade soil", (0.285, 0.215, 0.150), rough=1.0)
add_image(soil_mat, "soil.png", 2.2, 0.55,
          bump_strength=0.9, bump_distance=0.010)
add_tone_noise(soil_mat, 1.1, 0.5, dark=(0.70, 0.66, 0.62))

floor_mat = principled("Trench floor soil", (0.300, 0.235, 0.170), rough=1.0)
add_image(floor_mat, "soil.png", 1.6, 0.60,
          bump_strength=0.9, bump_distance=0.012)

stone_mats = []
for i, c in enumerate([(0.52, 0.51, 0.475), (0.42, 0.41, 0.39),
                       (0.60, 0.585, 0.55)]):
    m = principled("Cut stone %d" % i, c, rough=0.95)
    add_tone_noise(m, 6.0, 0.5)
    stone_mats.append(m)

pipe_mat = principled("Concrete pipe wall", (0.500, 0.510, 0.500),
                      rough=0.8)
add_image(pipe_mat, "concrete.png", 6.0, 0.45,
          bump_strength=0.4, bump_distance=0.002)
pipe_in_mat = principled("Pipe interior", (0.135, 0.150, 0.150), rough=0.55)
pipe_back_mat = principled("Pipe deep interior", (0.030, 0.033, 0.034),
                           rough=0.9)
pocket_mat = principled("Void pocket soil", (0.095, 0.070, 0.050), rough=1.0)
add_tone_noise(pocket_mat, 5.0, 0.6)
pocket_back_mat = principled("Void pocket deep", (0.045, 0.034, 0.024),
                             rough=1.0)
rim_mat = principled("Broken soil rim", (0.150, 0.115, 0.080), rough=1.0)
add_tone_noise(rim_mat, 7.0, 0.5)

curb_mat = principled("Curb concrete", (0.520, 0.520, 0.510), rough=0.9)
add_image(curb_mat, "concrete.png", 4.0, 0.4,
          bump_strength=0.4, bump_distance=0.002)
road_mat = principled("Asphalt road", (0.185, 0.188, 0.190), rough=0.96)
add_tone_noise(road_mat, 2.0, 0.6, dark=(0.70, 0.70, 0.70),
               light=(1.15, 1.15, 1.15))

puddle_mat = principled("Thin settled puddle", (0.160, 0.180, 0.190),
                        rough=0.05, metallic=0.0, ior=1.33)
puddle_mat.blend_method = "BLEND"
pnt = puddle_mat.node_tree
pbsdf = pnt.nodes.get("Principled BSDF")
pnoise = pnt.nodes.new("ShaderNodeTexNoise")
pnoise.inputs["Scale"].default_value = 9.0
pnoise.inputs["Detail"].default_value = 2.0
pbump = pnt.nodes.new("ShaderNodeBump")
pbump.inputs["Strength"].default_value = 0.55
pbump.inputs["Distance"].default_value = 0.0012
pcoord = pnt.nodes.new("ShaderNodeTexCoord")
pnt.links.new(pcoord.outputs["Object"], pnoise.inputs["Vector"])
pnt.links.new(pnoise.outputs["Fac"], pbump.inputs["Height"])
pnt.links.new(pbump.outputs["Normal"], pbsdf.inputs["Normal"])
# patchy micro-roughness so the sky reflection breaks up like real water
prnoise = pnt.nodes.new("ShaderNodeTexNoise")
prnoise.inputs["Scale"].default_value = 3.5
prnoise.inputs["Detail"].default_value = 2.0
prramp = pnt.nodes.new("ShaderNodeValToRGB")
prramp.color_ramp.elements[0].position = 0.35
prramp.color_ramp.elements[0].color = (0.08, 0.08, 0.08, 1.0)
prramp.color_ramp.elements[1].position = 0.75
prramp.color_ramp.elements[1].color = (0.30, 0.30, 0.30, 1.0)
pnt.links.new(pcoord.outputs["Object"], prnoise.inputs["Vector"])
pnt.links.new(prnoise.outputs["Fac"], prramp.inputs["Fac"])
pnt.links.new(prramp.outputs["Color"], pbsdf.inputs["Roughness"])
# (grazing view reflects the pale sky via the low roughness above)

damp_mat = bpy.data.materials.new("Damp halo")
damp_mat.use_nodes = True
dbsdf = damp_mat.node_tree.nodes.get("Principled BSDF")
dbsdf.inputs["Base Color"].default_value = (0.150, 0.140, 0.130, 1.0)
dbsdf.inputs["Roughness"].default_value = 0.95
damp_mat.blend_method = "BLEND"


def wire_vertex_alpha(mat, attr_name, alpha_scale=1.0):
    nt = mat.node_tree
    out = nt.nodes["Material Output"]
    surf_in = out.inputs["Surface"]
    src = surf_in.links[0].from_socket if surf_in.is_linked else None
    if src is None:
        return
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = attr_name
    transparent = nt.nodes.new("ShaderNodeBsdfTransparent")
    mixsh = nt.nodes.new("ShaderNodeMixShader")
    if alpha_scale != 1.0:
        math = nt.nodes.new("ShaderNodeMath")
        math.operation = "MULTIPLY"
        math.inputs[1].default_value = alpha_scale
        nt.links.new(attr.outputs["Color"], math.inputs[0])
        nt.links.new(math.outputs["Value"], mixsh.inputs["Fac"])
    else:
        nt.links.new(attr.outputs["Color"], mixsh.inputs["Fac"])
    nt.links.new(transparent.outputs["BSDF"], mixsh.inputs[1])
    nt.links.new(src, mixsh.inputs[2])
    nt.links.new(mixsh.outputs["Shader"], surf_in)


wire_vertex_alpha(puddle_mat, "Wet", 0.55)

sat_mat = bpy.data.materials.new("Saturated rim")
sat_mat.use_nodes = True
sbsdf = sat_mat.node_tree.nodes.get("Principled BSDF")
sbsdf.inputs["Base Color"].default_value = (0.100, 0.090, 0.080, 1.0)
sbsdf.inputs["Roughness"].default_value = 0.9
sat_mat.blend_method = "BLEND"
wire_vertex_alpha(sat_mat, "Sat", 0.55)
wire_vertex_alpha(damp_mat, "Damp", 0.30)


# ---------------- mesh helpers ----------------
def new_mesh_object(name, verts, faces, mat=None, smooth=False,
                    mat_slots=None, poly_mats=None, split=False):
    # split=True duplicates corners per face: coplanar faces then shade
    # exactly flat however the renderer interpolates vertex normals.
    if split:
        nv, nf = [], []
        for f in faces:
            base = len(nv)
            for vi in f:
                nv.append(verts[vi])
            nf.append(tuple(range(base, base + len(f))))
        verts, faces = nv, nf
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    if mat_slots:
        for m in mat_slots:
            mesh.materials.append(m)
    elif mat is not None:
        mesh.materials.append(mat)
    if poly_mats is not None:
        for poly, mi in zip(mesh.polygons, poly_mats):
            poly.material_index = mi
    for poly in mesh.polygons:
        poly.use_smooth = smooth
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


UNIT_CUBE = [(-.5, -.5, -.5), (.5, -.5, -.5), (.5, .5, -.5), (-.5, .5, -.5),
             (-.5, -.5, .5), (.5, -.5, .5), (.5, .5, .5), (-.5, .5, .5)]
# Outward-wound quads (CCW seen from outside): bottom, top, front(-Y),
# back(+Y), left(-X), right(+X).
CUBE_FACES = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4),
              (3, 7, 6, 2), (0, 4, 7, 3), (1, 2, 6, 5)]


def _assert_box_template():
    assert len(set(UNIT_CUBE)) == 8, "UNIT_CUBE must hold 8 distinct corners"
    for f in CUBE_FACES:
        assert len(set(f)) == 4, "box quad must reference 4 distinct corners"
        p = [Vector(v) for v in (UNIT_CUBE[f[0]], UNIT_CUBE[f[1]],
                                 UNIT_CUBE[f[2]], UNIT_CUBE[f[3]])]
        n = (p[1] - p[0]).cross(p[3] - p[0])
        assert abs(n.dot(p[2] - p[0])) < 1e-9, "box quad must be coplanar"
        a1 = (p[1] - p[0]).cross(p[2] - p[0]).length / 2
        a2 = (p[0] - p[2]).cross(p[3] - p[2]).length / 2
        assert a1 > 1e-12 and a2 > 1e-12, "box quad must have nonzero area"
        ctr = (p[0] + p[1] + p[2] + p[3]) / 4
        assert n.normalized().dot(ctr) > 0, \
            "box quad must wind outward (normal away from cube center)"


_assert_box_template()


def box_verts(center, dims, rot_x=0.0, rot_y=0.0, rot_z=0.0,
              jitter=0.0, rng=None):
    m = (Matrix.Translation(Vector(center))
         @ Matrix.Rotation(rot_x, 4, 'X')
         @ Matrix.Rotation(rot_y, 4, 'Y')
         @ Matrix.Rotation(rot_z, 4, 'Z')
         @ Matrix.Diagonal(Vector((*dims, 1.0))))
    out = []
    for v in UNIT_CUBE:
        p = m @ Vector(v)
        if jitter and rng is not None:
            p = Vector((p[0] + rng.uniform(-jitter, jitter),
                        p[1] + rng.uniform(-jitter, jitter),
                        p[2] + rng.uniform(-jitter, jitter)))
        out.append((p[0], p[1], p[2]))
    return out


jnx, jny = 60, 20
jv, jf = [], []
for j in range(jny + 1):
    yy = -0.02 + (PAVE_Y1 + 0.32) * j / jny
    for i in range(jnx + 1):
        xx = -PAVE_X - 0.3 + (2 * PAVE_X + 0.6) * i / jnx
        dz = dip_at(xx, yy) if SETTLED else 0.0
        jv.append((xx, yy, TOP_Z - dz - 0.006))
for j in range(jny):
    for i in range(jnx):
        a = j * (jnx + 1) + i
        jf.append((a, a + 1, a + jnx + 2, a + jnx + 1))
joint = new_mesh_object("JointBed", jv, jf, mat=joint_mat)

# ---------------- pavers: joined mesh, rigid per-paver dip + tilt ----------------
step_x = PAVER_L + JOINT
step_y = PAVER_WD + JOINT
p_verts, p_faces, p_tone = [], [], []
row = 0
py = PAVER_WD / 2.0
while py - PAVER_WD / 2.0 < PAVE_Y1:
    offset = (step_x / 2.0) if (row % 2) else 0.0
    px = -PAVE_X + PAVER_L / 2.0 + offset
    while px - PAVER_L / 2.0 < PAVE_X:
        cx = min(max(px, -PAVE_X - 0.25), PAVE_X + 0.25)
        cy = py
        dz = (dip_at(cx, cy) if SETTLED else 0.0)
        if row == 0:
            # sawn section edge: flush, near-uniform credible concrete
            # (keeps rigid dip + tilt, drops random jitter/tone steps)
            jz = R_PAVER.uniform(-0.0005, 0.0005)
            rx = 0.0
            ry = (dip_slope(cx, cy) if SETTLED else 0.0)
            rz = 0.0
            tone = R_PAVER.uniform(0.92, 0.94)
        else:
            jz = R_PAVER.uniform(-0.0012, 0.0012)
            rx = R_PAVER.uniform(-0.001, 0.001)
            ry = (dip_slope(cx, cy) if SETTLED else 0.0) + \
                R_PAVER.uniform(-0.001, 0.001)
            rz = R_PAVER.uniform(-0.002, 0.002)
            tone = R_PAVER.uniform(0.93, 1.00)
            if R_PAVER.random() < 0.04:
                tone *= R_PAVER.uniform(0.88, 0.94)
        cz = TOP_Z - PAVER_H / 2.0 - dz + jz
        box = box_verts((cx, cy, cz), (PAVER_L, PAVER_WD, PAVER_H),
                        rot_x=rx, rot_y=ry, rot_z=rz)
        # split corners per face: every paver end/top reads flat concrete
        for (a, b, c, d) in CUBE_FACES:
            base = len(p_verts)
            for vi in (a, b, c, d):
                p_verts.append(box[vi])
            p_faces.append((base, base + 1, base + 2, base + 3))
        p_tone.extend([tone] * 24)
        px += step_x
    row += 1
    py += step_y
pavers = new_mesh_object("Pavers", p_verts, p_faces, mat=paver_mat)
tm = pavers.data.color_attributes.new(name="Tone", type='FLOAT_COLOR',
                                     domain='POINT')
for i, t in enumerate(p_tone):
    tm.data[i].color = (t, t, t, 1.0)
pnt2 = paver_mat.node_tree
pbsdf2 = pnt2.nodes.get("Principled BSDF")
tattr = pnt2.nodes.new("ShaderNodeAttribute")
tattr.attribute_name = "Tone"
tmult = pnt2.nodes.new("ShaderNodeMixRGB")
tmult.blend_type = "MULTIPLY"
tmult.inputs[0].default_value = 1.0
tbase = pbsdf2.inputs["Base Color"]
tmult.inputs[1].default_value = (1.0, 1.0, 1.0, 1.0)
pnt2.links.new(tattr.outputs["Color"], tmult.inputs[2])
if tbase.is_linked:
    tmult.inputs[1].default_value = (1.0, 1.0, 1.0, 1.0)
    src = tbase.links[0].from_socket
    pnt2.links.new(src, tmult.inputs[1])
pnt2.links.new(tmult.outputs["Color"], tbase)


# ---------------- cut face: one displaced grid, wavy layer bounds ----------------
def b1(x):
    return BED_BOT + 0.008 * math.sin(x * 3.1 + 0.7)


def b2(x):
    return BASE_BOT + 0.020 * math.sin(x * 1.7 + 2.0)


def zone_of(z, x):
    if z > b1(x):
        return 0
    if z > b2(x):
        return 1
    return 2


def h2(i, j):
    return (math.sin(i * 127.1 + j * 311.7) * 43758.5453) % 1.0


def vnoise(x, z):
    s = 11.0
    ix, iz = math.floor(x * s), math.floor(z * s)
    fx, fz = x * s - ix, z * s - iz
    sx = fx * fx * (3 - 2 * fx)
    sz = fz * fz * (3 - 2 * fz)
    a = h2(ix, iz)
    b = h2(ix + 1, iz)
    c = h2(ix, iz + 1)
    d = h2(ix + 1, iz + 1)
    return (a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz)


def cav_wobble(a):
    return 1.0 + 0.22 * math.sin(3 * a + 1.7) + 0.13 * math.sin(7 * a + 0.4)


def cav_inside(x, z, f=1.0):
    dx = (x - CAV_CX) / (CAV_RX * f)
    dz = (z - CAV_CZ) / (CAV_RZ * f)
    r = math.hypot(dx, dz)
    if r >= 1.0:
        return False
    if r == 0.0:
        return True
    return r < cav_wobble(math.atan2(dz, dx))


def face_dy(x, z):
    zn = zone_of(z, x)
    amp = (0.002, 0.007, 0.012)[zn]
    return (vnoise(x + zn * 13.7, z) - 0.5) * 2 * amp


def face_top(x):
    # Bedding surface meets the actual block bottoms: in the settled state
    # the support follows the dipped blocks down (support loss) instead of
    # a rigid unchanging edge cutting through them.
    return TOP_Z - PAVER_H - (dip_at(x, 0.05) if SETTLED else 0.0)


NX, NZ = 420, 96
f_verts = []
for j in range(NZ + 1):
    for i in range(NX + 1):
        x = -FACE_X + 2 * FACE_X * i / NX
        zt = face_top(x)
        z = zt + (FACE_BOT - zt) * j / NZ
        y = face_dy(x, z) + R_FACE.uniform(-0.0015, 0.0015)
        f_verts.append((x, y, z))
kept = []
for j in range(NZ):
    for i in range(NX):
        a = j * (NX + 1) + i
        b, c, d = a + 1, a + NX + 1, a + NX + 2
        cx = (f_verts[a][0] + f_verts[d][0]) / 2
        cz = (f_verts[a][2] + f_verts[d][2]) / 2
        if SETTLED and cav_inside(cx, cz, 1.0):
            continue
        if math.hypot(cx - PIPE_X, cz - PIPE_Z) < PIPE_RO + 0.006:
            continue  # pipe mouth passes through the cut face, both states
        kept.append((i, j, a, b, c, d, zone_of(cz, cx)))
f_faces, f_mats = [], []
for (i, j, a, b, c, d, m) in kept:
    f_faces.append((a, b, d, c))
    f_mats.append(m)
face = new_mesh_object("CutFace", f_verts, f_faces,
                       mat_slots=[bedding_mat, base_mat, soil_mat],
                       poly_mats=f_mats, smooth=True)

# half-embedded crushed stones give the face true relief
s_verts, s_faces, s_mats = [], [], []
NSTONE = 210
for s in range(NSTONE):
    u = R_STONE.random()
    if u < 0.12:
        z = R_STONE.uniform(b1(0) - 0.03, TOP_Z - PAVER_H - 0.004)
    elif u < 0.62:
        z = R_STONE.uniform(b2(0) - 0.10, b1(0) - 0.015)
    else:
        z = R_STONE.uniform(FACE_BOT + 0.05, b2(0) - 0.02)
    x = R_STONE.uniform(-FACE_X + 0.1, FACE_X - 0.1)
    if SETTLED and cav_inside(x, z, 1.25):
        continue
    if math.hypot(x - PIPE_X, z - PIPE_Z) < PIPE_RO + 0.020:
        continue
    if z > b1(x) - 0.03:
        sc = R_STONE.uniform(0.006, 0.018)
    elif z > b2(x) - 0.05:
        sc = R_STONE.uniform(0.010, 0.032)
    else:
        sc = R_STONE.uniform(0.006, 0.020)
    sy = R_STONE.uniform(-0.002, 0.006)
    base = len(s_verts)
    s_verts.extend(box_verts(
        (x, sy, z),
        (sc, sc * R_STONE.uniform(0.35, 0.6), sc * R_STONE.uniform(0.6, 1.0)),
        rot_x=R_STONE.uniform(0, 3.14), rot_y=R_STONE.uniform(0, 3.14),
        rot_z=R_STONE.uniform(0, 3.14),
        jitter=sc * 0.22, rng=R_STONE))
    s_faces.extend([(base + a, base + b, base + c, base + d)
                    for (a, b, c, d) in CUBE_FACES])
    s_mats.extend([s % 3] * 6)
stones = new_mesh_object("CutStones", s_verts, s_faces,
                         mat_slots=stone_mats, poly_mats=s_mats, smooth=True)

# ---------------- hollow pipe: wall ring + dark tube + deep cap ----------------
SEG = 48
po_verts, po_faces = [], []
for k in range(SEG + 1):
    a = 2 * math.pi * k / SEG
    ca, sa = math.cos(a), math.sin(a)
    po_verts.append((PIPE_X + PIPE_RO * ca, -0.012, PIPE_Z + PIPE_RO * sa))
    po_verts.append((PIPE_X + PIPE_RI * ca, -0.012, PIPE_Z + PIPE_RI * sa))
for k in range(SEG):
    if SETTLED and 75.0 <= 360.0 * (k + 0.5) / SEG <= 105.0:
        continue  # small conditional crown loss, settled state only
    po_faces.append((2 * k, 2 * k + 2, 2 * k + 3, 2 * k + 1))
new_mesh_object("PipeWallRing", po_verts, po_faces, mat=pipe_mat,
                smooth=True)

# dark shadow gasket: the sawn soil edge around the pipe mouth, both states
GASK_IN, GASK_OUT = PIPE_RO - 0.002, PIPE_RO + 0.026
ga_verts, ga_faces = [], []
for k in range(SEG + 1):
    a = 2 * math.pi * k / SEG
    ca, sa = math.cos(a), math.sin(a)
    ga_verts.append((PIPE_X + GASK_IN * ca, -0.001,
                     PIPE_Z + GASK_IN * sa))
    ga_verts.append((PIPE_X + GASK_OUT * ca, -0.001,
                     PIPE_Z + GASK_OUT * sa))
for k in range(SEG):
    ga_faces.append((2 * k, 2 * k + 2, 2 * k + 3, 2 * k + 1))
gasket_mat = bpy.data.materials.new("Pipe soil gasket")
gasket_mat.use_nodes = True
gasket_mat.node_tree.nodes.get(
    "Principled BSDF").inputs["Base Color"].default_value = (
        0.055, 0.045, 0.035, 1.0)
new_mesh_object("PipeGasket", ga_verts, ga_faces, mat=gasket_mat)

ti_verts, ti_faces = [], []
for j in range(2):
    y = -0.012 + (PIPE_LEN + 0.012) * j
    for k in range(SEG + 1):
        a = 2 * math.pi * k / SEG
        ti_verts.append((PIPE_X + PIPE_RI * math.cos(a), y,
                         PIPE_Z + PIPE_RI * math.sin(a)))
for k in range(SEG):
    if SETTLED and 75.0 <= 360.0 * (k + 0.5) / SEG <= 105.0:
        continue  # opening matches the wall loss above
    ti_faces.append((k, k + 1, k + SEG + 2, k + SEG + 1))
new_mesh_object("PipeInterior", ti_verts, ti_faces, mat=pipe_in_mat,
                smooth=True)

cb_verts = [(PIPE_X, -0.012 + PIPE_LEN, PIPE_Z)]
for k in range(SEG + 1):
    a = 2 * math.pi * k / SEG
    cb_verts.append((PIPE_X + PIPE_RI * math.cos(a),
                     -0.012 + PIPE_LEN, PIPE_Z + PIPE_RI * math.sin(a)))
cb_faces = [(0, 1 + k + 1, 1 + k) for k in range(SEG)]
new_mesh_object("PipeBackCap", cb_verts, cb_faces, mat=pipe_back_mat)


# ---------------- settled-only: recessed void pocket + rim + crumbs ------------
if SETTLED:
    N = 48
    rim = []
    for k in range(N):
        a = 2 * math.pi * k / N
        w = cav_wobble(a)
        rim.append((CAV_CX + CAV_RX * w * math.cos(a), 0.002,
                    CAV_CZ + CAV_RZ * w * math.sin(a)))
    ring_defs = [(0.0, 1.0, 0.0), (0.06, 0.80, 1.0), (0.12, 0.58, 2.0),
                 (0.18, 0.34, 3.0)]
    rings = []
    for depth, shrink, js in ring_defs:
        pts = []
        for k in range(N):
            a = 2 * math.pi * k / N
            w = cav_wobble(a + js * 0.35)
            jx = R_POCKET.uniform(-0.012, 0.012) * js
            jz = R_POCKET.uniform(-0.008, 0.008) * js
            pts.append((CAV_CX + CAV_RX * shrink * w * math.cos(a) + jx,
                        0.002 + depth, CAV_CZ + CAV_RZ * shrink * w
                        * math.sin(a) + jz))
        rings.append(pts)
    pk_verts, pk_faces, pk_mats = [], [], []
    for r in rings:
        pk_verts.extend(r)
    for q in range(len(rings) - 1):
        for k in range(N):
            k2 = (k + 1) % N
            pk_faces.append((q * N + k, q * N + k2,
                             (q + 1) * N + k2, (q + 1) * N + k))
            pk_mats.append(0)
    cap_c = len(pk_verts)
    cx = sum(p[0] for p in rings[-1]) / N
    cy = sum(p[1] for p in rings[-1]) / N
    cz = sum(p[2] for p in rings[-1]) / N
    pk_verts.append((cx, cy, cz))
    for k in range(N):
        k2 = (k + 1) % N
        pk_faces.append(((len(rings) - 1) * N + k,
                         (len(rings) - 1) * N + k2, cap_c))
        pk_mats.append(1)
    new_mesh_object("VoidPocket", pk_verts, pk_faces,
                    mat_slots=[pocket_mat, pocket_back_mat],
                    poly_mats=pk_mats, smooth=True)

    # ---- stitched collar: exact hole boundary -> draped outer loop ----
    # Covers the grid staircase with real collar geometry (no flat sticker).
    edge_count = {}
    for (ci, cj, a, b, c, d, m) in kept:
        for e in ((a, b), (b, d), (d, c), (c, a)):
            key = (e[0], e[1]) if e[0] < e[1] else (e[1], e[0])
            edge_count[key] = edge_count.get(key, 0) + 1
    border = set()
    for ii in (0, NX):
        for jj in range(NZ + 1):
            border.add(jj * (NX + 1) + ii)
    for jj in (0, NZ):
        for ii in range(NX + 1):
            border.add(jj * (NX + 1) + ii)
    bnd = [e for e, n in edge_count.items()
           if n == 1 and not (e[0] in border and e[1] in border)]
    adj = {}
    for ei, e in enumerate(bnd):
        adj.setdefault(e[0], []).append(ei)
        adj.setdefault(e[1], []).append(ei)
    used = [False] * len(bnd)
    loops = []
    for s_idx in range(len(bnd)):
        if used[s_idx]:
            continue
        used[s_idx] = True
        loop = [bnd[s_idx][0], bnd[s_idx][1]]
        while len(loop) < len(bnd) + 1:
            cur = loop[-1]
            nxt = None
            for ei in adj.get(cur, []):
                if not used[ei]:
                    e = bnd[ei]
                    nxt = e[1] if e[0] == cur else e[0]
                    used[ei] = True
                    break
            if nxt is None:
                break
            if nxt == loop[0]:
                break
            loop.append(nxt)
        loops.append(loop)
    cav_loop = None
    best = 1e9
    for lp in loops:
        gx = sum(f_verts[v][0] for v in lp) / len(lp)
        gz = sum(f_verts[v][2] for v in lp) / len(lp)
        dd = math.hypot(gx - CAV_CX, gz - CAV_CZ)
        if dd < best:
            best = dd
            cav_loop = lp
    if cav_loop is not None and len(cav_loop) >= 8:
        pts = [f_verts[v] for v in cav_loop]
        area = 0.0
        for q in range(len(pts)):
            x0, z0 = pts[q][0], pts[q][2]
            x1, z1 = pts[(q + 1) % len(pts)][0], pts[(q + 1) % len(pts)][2]
            area += x0 * z1 - x1 * z0
        if area < 0:
            pts = pts[::-1]
        cum = [0.0]
        for q in range(1, len(pts) + 1):
            p0 = pts[(q - 1) % len(pts)]
            p1 = pts[q % len(pts)]
            cum.append(cum[-1] + math.hypot(p1[0] - p0[0], p1[2] - p0[2]))
        total = cum[-1]
        inner = []
        for m in range(N):
            target = total * m / N
            q = 0
            while q < len(pts) and cum[q + 1] < target:
                q += 1
            p0 = pts[q % len(pts)]
            p1 = pts[(q + 1) % len(pts)]
            seg = cum[q + 1] - cum[q]
            t = 0.0 if seg <= 0 else (target - cum[q]) / seg
            inner.append((p0[0] + (p1[0] - p0[0]) * t,
                          p0[1] + (p1[1] - p0[1]) * t,
                          p0[2] + (p1[2] - p0[2]) * t))
        outer = []
        for k in range(N):
            a = 2 * math.pi * k / N
            w = cav_wobble(a)
            ox = CAV_CX + CAV_RX * 1.22 * w * math.cos(a)
            oz = CAV_CZ + CAV_RZ * 1.22 * w * math.sin(a)
            outer.append((ox, face_dy(ox, oz) + 0.003, oz))
        best_rot, best_err = 0, 1e18
        for rot in range(N):
            err = 0.0
            for m in range(N):
                p = inner[m]
                q = outer[(m + rot) % N]
                err += (p[0] - q[0]) ** 2 + (p[2] - q[2]) ** 2
            if err < best_err:
                best_err, best_rot = err, rot
        co_verts = inner + [outer[(m + best_rot) % N] for m in range(N)]
        co_faces = [(m, (m + 1) % N, N + (m + 1) % N, N + m)
                    for m in range(N)]
        new_mesh_object("VoidCollar", co_verts, co_faces, mat=rim_mat,
                        smooth=True)

    c_verts, c_faces = [], []
    for s in range(14):
        a = R_POCKET.uniform(0, 6.28)
        rr = R_POCKET.uniform(0.02, 0.16)
        x = CAV_CX + rr * math.cos(a)
        z = CAV_CZ - 0.02 + R_POCKET.uniform(-0.03, 0.03)
        sc = R_POCKET.uniform(0.006, 0.020)
        base = len(c_verts)
        c_verts.extend(box_verts((x, 0.10, z), (sc, sc * 0.6, sc * 0.7),
                                 rot_y=R_POCKET.uniform(0, 3.14),
                                 jitter=sc * 0.2, rng=R_POCKET))
        c_faces.extend([(base + a2, base + b2, base + c2, base + d2)
                       for (a2, b2, c2, d2) in CUBE_FACES])
    new_mesh_object("PocketCrumbs", c_verts, c_faces, mat=rim_mat)

    # spalled lips at the small crown loss (settled conditional only)
    n_verts, n_faces = [], []
    for sx, sang in ((-1, 72.0), (1, 108.0)):
        a = math.radians(sang)
        x = PIPE_X + (PIPE_RO + 0.008) * math.cos(a)
        z = PIPE_Z + (PIPE_RO + 0.008) * math.sin(a)
        sc = 0.016
        base = len(n_verts)
        n_verts.extend(box_verts((x, -0.004, z), (sc, sc * 0.6, sc * 0.7),
                                 rot_y=R_POCKET.uniform(0, 3.14),
                                 jitter=sc * 0.25, rng=R_POCKET))
        n_faces.extend([(base + a2, base + b2, base + c2, base + d2)
                        for (a2, b2, c2, d2) in CUBE_FACES])
    new_mesh_object("NotchLips", n_verts, n_faces, mat=rim_mat, smooth=True)

    # No connector path is drawn: the pocket and the small crown loss
    # coexist as separate observations; no loss route is claimed.

    # standing water: approximately horizontal plane clipped to the actual
    # depressed surface. Blocks/joints above the level emerge (physical);
    # feathered alpha only at the exact waterline contact.
    ZW = TOP_Z - 0.028
    WNX, WNY = 48, 36
    WX0, WX1, WY0, WY1 = -0.25, 0.95, -0.05, 1.45
    pw_verts, pw_faces, pw_wet = [], [], []
    for j in range(WNY + 1):
        yy = WY0 + (WY1 - WY0) * j / WNY
        for i in range(WNX + 1):
            xx = WX0 + (WX1 - WX0) * i / WNX
            depth = dip_at(xx, yy) - 0.028
            wet = max(0.0, min(1.0, depth / 0.005)) * 0.85
            pw_verts.append((xx, yy, ZW))
            pw_wet.append(wet)
    for j in range(WNY):
        for i in range(WNX):
            a = j * (WNX + 1) + i
            b, c, d = a + 1, a + WNX + 1, a + WNX + 2
            if pw_wet[a] <= 0.01 and pw_wet[b] <= 0.01 and \
               pw_wet[c] <= 0.01 and pw_wet[d] <= 0.01:
                continue
            pw_faces.append((a, c, d, b))
    puddle = new_mesh_object("Puddle", pw_verts, pw_faces, mat=puddle_mat)
    wm = puddle.data.color_attributes.new(name="Wet", type='FLOAT_COLOR',
                                         domain='POINT')
    for i, w in enumerate(pw_wet):
        wm.data[i].color = (w, w, w, 1.0)

    # darker saturated ring computed from the actual waterline contour:
    # wettest exactly where the surface meets the level, fading both ways.
    SNX, SNY = 44, 32
    SX0, SX1, SY0, SY1 = -0.40, 1.10, -0.15, 1.75
    st_verts, st_faces, st_a = [], [], []
    for j in range(SNY + 1):
        yy = SY0 + (SY1 - SY0) * j / SNY
        for i in range(SNX + 1):
            xx = SX0 + (SX1 - SX0) * i / SNX
            top = TOP_Z - dip_at(xx, yy)
            al = 0.55 * math.exp(-((top - ZW) / 0.005) ** 2)
            st_verts.append((xx, yy, top + 0.002))
            st_a.append(al)
    for j in range(SNY):
        for i in range(SNX):
            a = j * (SNX + 1) + i
            b, c, d = a + 1, a + SNX + 1, a + SNX + 2
            if st_a[a] <= 0.02 and st_a[b] <= 0.02 and \
               st_a[c] <= 0.02 and st_a[d] <= 0.02:
                continue
            st_faces.append((a, c, d, b))
    sat = new_mesh_object("SatRim", st_verts, st_faces, mat=sat_mat)
    sm = sat.data.color_attributes.new(name="Sat", type='FLOAT_COLOR',
                                       domain='POINT')
    for i, w in enumerate(st_a):
        sm.data[i].color = (w, w, w, 1.0)

    DNX, DNY = 30, 20
    dh_verts, dh_faces, dh_w = [], [], []
    for j in range(DNY + 1):
        yy = PUD_CY - PUD_RY * 1.55 + 2 * PUD_RY * 1.55 * j / DNY
        for i in range(DNX + 1):
            xx = PUD_CX - PUD_RX * 1.55 + 2 * PUD_RX * 1.55 * i / DNX
            dx = (xx - PUD_CX) / (PUD_RX * 1.15)
            dy = (yy - PUD_CY) / (PUD_RY * 1.15)
            r = math.hypot(dx, dy)
            w = max(0.0, min(1.0, (1.15 - r) / 0.5))
            zt = TOP_Z - dip_at(xx, yy) + 0.0025
            dh_verts.append((xx, yy, zt))
            dh_w.append(w)
    for j in range(DNY):
        for i in range(DNX):
            a = j * (DNX + 1) + i
            b, c, d = a + 1, a + DNX + 1, a + DNX + 2
            if dh_w[a] <= 0.02 and dh_w[b] <= 0.02 and \
               dh_w[c] <= 0.02 and dh_w[d] <= 0.02:
                continue
            dh_faces.append((a, c, d, b))
    damp = new_mesh_object("DampHalo", dh_verts, dh_faces, mat=damp_mat)
    dm = damp.data.color_attributes.new(name="Damp", type='FLOAT_COLOR',
                                       domain='POINT')
    for i, w in enumerate(dh_w):
        dm.data[i].color = (w, w, w, 1.0)


# ---------------- trench floor, curb, road, sky handled by world ----------------
fl_nx, fl_nz, fl_verts, fl_faces = 60, 30, [], []
for j in range(fl_nz + 1):
    y = -4.5 + 4.7 * j / fl_nz
    for i in range(fl_nx + 1):
        x = -7.0 + 14.0 * i / fl_nx
        z = FACE_BOT + (vnoise(x * 0.8, y * 0.8) - 0.5) * 0.05
        fl_verts.append((x, y, z))
for j in range(fl_nz):
    for i in range(fl_nx):
        a = j * (fl_nx + 1) + i
        fl_faces.append((a, a + 1, a + fl_nx + 2, a + fl_nx + 1))
new_mesh_object("TrenchFloor", fl_verts, fl_faces, mat=floor_mat,
                smooth=True)

f_verts2, f_faces2 = [], []
for s in range(110):
    x = R_FLOOR.uniform(-6.5, 6.5)
    y = R_FLOOR.uniform(-4.2, -0.15)
    z = FACE_BOT + 0.005 + R_FLOOR.uniform(0, 0.01)
    sc = R_FLOOR.uniform(0.005, 0.030)
    if R_FLOOR.random() < 0.08:
        sc = R_FLOOR.uniform(0.03, 0.07)
    base = len(f_verts2)
    f_verts2.extend(box_verts((x, y, z), (sc, sc * 0.7, sc * 0.6),
                              rot_z=R_FLOOR.uniform(0, 3.14),
                              jitter=sc * 0.25, rng=R_FLOOR))
    f_faces2.extend([(base + a, base + b, base + c, base + d)
                     for (a, b, c, d) in CUBE_FACES])
new_mesh_object("FloorCrumbs", f_verts2, f_faces2, mat=soil_mat,
                smooth=True)

new_mesh_object("Curb",
                [(-8.0, PAVE_Y1, 0.0), (8.0, PAVE_Y1, 0.0),
                 (8.0, PAVE_Y1 + 0.30, 0.0), (-8.0, PAVE_Y1 + 0.30, 0.0),
                 (-8.0, PAVE_Y1, 0.14), (8.0, PAVE_Y1, 0.14),
                 (8.0, PAVE_Y1 + 0.30, 0.14),
                 (-8.0, PAVE_Y1 + 0.30, 0.14)],
                [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4),
                 (3, 7, 6, 2), (0, 4, 7, 3), (1, 2, 6, 5)],
                mat=curb_mat, split=True)

rd_verts = [(-14.0, PAVE_Y1 + 0.30, 0.005), (14.0, PAVE_Y1 + 0.30, 0.005),
            (14.0, 40.0, 0.005), (-14.0, 40.0, 0.005)]
new_mesh_object("Road", rd_verts, [(0, 1, 2, 3)], mat=road_mat)


# ---------------- overcast lights ----------------
def aim(obj, target):
    d = Vector(target) - obj.location
    obj.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


key_data = bpy.data.lights.new("Key softbox", "AREA")
key_data.energy = 380.0
key_data.size = 10.0
key = bpy.data.objects.new("Key softbox", key_data)
bpy.context.collection.objects.link(key)
key.location = (2.0, -3.5, 5.5)
aim(key, (0.3, 0.8, -0.4))

fill_data = bpy.data.lights.new("Sky fill", "AREA")
fill_data.energy = 200.0
fill_data.size = 12.0
fill = bpy.data.objects.new("Sky fill", fill_data)
bpy.context.collection.objects.link(fill)
fill.location = (-1.5, 1.5, 6.0)
aim(fill, (0.3, 0.5, -0.4))

face_data = bpy.data.lights.new("Face lift", "AREA")
face_data.energy = 130.0
face_data.size = 6.0
facel = bpy.data.objects.new("Face lift", face_data)
bpy.context.collection.objects.link(facel)
facel.location = (0.4, -3.0, 0.9)
aim(facel, (0.4, 0.3, -0.4))

sun_data = bpy.data.lights.new("Flat sun", "SUN")
sun_data.energy = 0.6
try:
    sun_data.angle = 0.12
except AttributeError:
    pass
sun = bpy.data.objects.new("Flat sun", sun_data)
bpy.context.collection.objects.link(sun)
sun.location = (-4.0, -3.0, 6.0)
aim(sun, (0.3, 0.8, -0.4))


# ---------------- perspective camera: street continues past frame ----------------
cam_data = bpy.data.cameras.new("SectionCam")
cam_data.type = "PERSP"
cam_data.lens = 40.0
cam = bpy.data.objects.new("SectionCam", cam_data)
bpy.context.collection.objects.link(cam)
cam.location = (0.35, -2.30, 1.05)
aim(cam, (0.40, 0.55, -0.35))
scene.camera = cam


scene.render.filepath = os.path.join(OUT, STATE + "_%04d.png" % 1)
bpy.ops.render.render(write_still=True)

ntris = sum(len(o.data.polygons) for o in bpy.context.scene.objects
            if o.type == 'MESH' and o.data is not None)
print("REALISM_STILL state=%s samples=%d size=%dx%d tris=%d seconds=%.1f" %
      (STATE, SAMPLES, RES_W, RES_H, ntris, time.time() - T0))

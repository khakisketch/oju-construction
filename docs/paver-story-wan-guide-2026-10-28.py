"""Controlled cutaway guide for an AI video experiment; not a field simulation.

Run with Blender 4.0: blender -b --factory-startup -P this_file.py -- --test 46
Set PAVER_OUT_DIR to a NEW, empty directory; animation writes frames 0..60 there.
No third-party images or models are embedded in this Blender guide.
"""
import math
import os
import random
import sys

import bpy

random.seed(20261028)
FRAMES = 61
OUT = os.environ.get("PAVER_OUT_DIR")
if not OUT:
    raise RuntimeError("Set PAVER_OUT_DIR to a new empty output directory")
os.makedirs(OUT, exist_ok=True)

for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = int(os.environ.get("PAVER_SAMPLES", "28"))
scene.cycles.use_denoising = False
scene.render.resolution_x = 960
scene.render.resolution_y = 540
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.frame_start = 0
scene.frame_end = FRAMES - 1
scene.world.use_nodes = True
world = scene.world.node_tree.nodes.get("Background")
world.inputs["Color"].default_value = (0.028, 0.073, 0.14, 1)
world.inputs["Strength"].default_value = 0.8


def material(name, light, dark=None, scale=12, roughness=0.9, bump=0.07):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*light, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    if dark:
        nt = mat.node_tree
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Detail"].default_value = 3
        coord = nt.nodes.new("ShaderNodeTexCoord")
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.2
        ramp.color_ramp.elements[0].color = (*dark, 1)
        ramp.color_ramp.elements[1].position = 0.8
        ramp.color_ramp.elements[1].color = (*light, 1)
        nt.links.new(coord.outputs["Object"], tex.inputs["Vector"])
        nt.links.new(tex.outputs["Fac"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
        node = nt.nodes.new("ShaderNodeBump")
        node.inputs["Strength"].default_value = bump
        node.inputs["Distance"].default_value = 0.018
        nt.links.new(tex.outputs["Fac"], node.inputs["Height"])
        nt.links.new(node.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


soil = material("Subgrade - brown", (0.28, 0.21, 0.16), (0.16, 0.11, 0.08), 9, bump=0.16)
aggregate = material("Compacted aggregate", (0.48, 0.46, 0.41), (0.26, 0.25, 0.22), 21, bump=0.12)
bedding = material("Bedding sand", (0.59, 0.52, 0.41), (0.38, 0.34, 0.28), 30, bump=0.09)
paver_mats = [
    material("Paver warm grey", (0.39, 0.41, 0.40), (0.27, 0.28, 0.27), 45, bump=0.10),
    material("Paver mid grey", (0.34, 0.36, 0.36), (0.25, 0.26, 0.26), 38, bump=0.10),
    material("Paver cool grey", (0.43, 0.44, 0.42), (0.31, 0.32, 0.30), 45, bump=0.10),
]
gravel_colors = [material("Stone %s" % i, c) for i, c in enumerate([
    (0.52, 0.51, 0.47), (0.38, 0.38, 0.35), (0.60, 0.58, 0.52), (0.31, 0.32, 0.31)
])]
pipe_wall = material("Concrete pipe wall", (0.54, 0.56, 0.54), (0.38, 0.40, 0.39), 20, bump=0.07)
pipe_inside = material("Pipe interior", (0.18, 0.22, 0.22), (0.12, 0.15, 0.15), 14, bump=0.04)
cavity_mat = material("Exaggerated loose cavity", (0.26, 0.22, 0.17), (0.13, 0.11, 0.09), 25, bump=0.10)
grain_mat = material("Migrating fines", (0.64, 0.56, 0.42), roughness=0.9)
water_mat = material("Muted wet sheen", (0.29, 0.47, 0.51), roughness=0.22)
water_mat.node_tree.nodes.get("Principled BSDF").inputs["Metallic"].default_value = 0.16
rain_mat = material("Soft rain", (0.44, 0.62, 0.68), roughness=0.35)
stage_mat = material("Backdrop base", (0.041, 0.088, 0.14), roughness=1)


def box(name, loc, dims, mat, bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Small rounded edge", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    return obj


def animate_scale(obj, keys):
    for frame, scale in keys:
        obj.scale = scale
        obj.keyframe_insert("scale", frame=frame)


def settlement(x):
    return -0.22 * math.exp(-((x - 0.9) / 1.20) ** 2)


def layer(name, bottom, top, mat, bottom_factor, top_factor):
    # A connected mesh whose bedding and aggregate sink with the pavers.
    subdivisions = 80
    verts = []
    for i in range(subdivisions + 1):
        x = -5 + 10 * i / subdivisions
        verts.extend([(x, -1.45, bottom), (x, 1.45, bottom),
                      (x, -1.45, top), (x, 1.45, top)])
    faces = []
    for i in range(subdivisions):
        a, b = 4 * i, 4 * (i + 1)
        faces.extend([(a, b, b + 2, a + 2), (a + 1, a + 3, b + 3, b + 1),
                      (a + 2, b + 2, b + 3, a + 3), (a + 1, b + 1, b, a)])
    faces.extend([(0, 2, 3, 1), (4 * subdivisions, 4 * subdivisions + 1,
                                    4 * subdivisions + 3, 4 * subdivisions + 2)])
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    obj.shape_key_add(name="Basis")
    key = obj.shape_key_add(name="Settled")
    for idx, vertex in enumerate(key.data):
        factor = top_factor if idx % 4 >= 2 else bottom_factor
        vertex.co.z += settlement(vertex.co.x) * factor
    for frame, value in [(0, 0), (30, 0), (46, 1), (60, 1)]:
        key.value = value
        key.keyframe_insert("value", frame=frame)
    return obj


box("Diorama foundation", (0, 0, -0.12), (10.4, 3.15, 0.22), stage_mat, bevel=0.02)
layer("Subgrade", 0, 1.4, soil, 0, 0)
layer("Compacted aggregate", 1.4, 2.65, aggregate, 0, 0.55)
layer("Sand bedding", 2.65, 3.0, bedding, 0.55, 1)

# Four rows of modestly sized interlocking concrete pavers, not six large bricks.
for row in range(4):
    y = -1.095 + row * 0.73
    for i in range(18):
        x = -4.72 + i * 0.555
        paver = box("Paver %02d row %d" % (i, row), (x, y, 3.11),
                    (0.535, 0.708, 0.22), paver_mats[(i + row * 2) % 3], bevel=0.018)
        dz = settlement(x)
        for frame, amount in [(0, 0), (30, 0), (46, 1), (60, 1)]:
            paver.location.z = 3.11 + amount * dz
            paver.keyframe_insert("location", frame=frame)

# Small embedded aggregates on the visible cut face; do not confuse them with a cavity.
for i in range(210):
    x = random.uniform(-4.93, 4.93)
    z = random.uniform(1.48, 2.58)
    # Keep the later cavity area readable and leave the pipe mouth unobstructed.
    if ((x - 1.15) / .9) ** 2 + ((z - 2.38) / .34) ** 2 < 1.1:
        continue
    if (x - 1.55) ** 2 + (z - 1.85) ** 2 < .5 ** 2:
        continue
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(.018, .055),
                                         location=(x, -1.463, z))
    stone = bpy.context.object
    stone.name = "Aggregate grain"
    stone.scale.y = 0.28
    stone.data.materials.append(gravel_colors[i % len(gravel_colors)])

# A cut pipe close beneath the affected bedding, with a small open upper-left gap.
px, pz, radius = 1.55, 1.84, 0.38
bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=radius * .83, depth=.025,
                                   location=(px, -1.50, pz), rotation=(math.pi / 2, 0, 0))
pipe = bpy.context.object
pipe.name = "Pipe interior at cut face"
pipe.data.materials.append(pipe_inside)
verts, faces = [], []
for k in range(65):
    a = 2 * math.pi * k / 64
    for r in (radius * .82, radius):
        verts.append((px + r * math.cos(a), -1.515, pz + r * math.sin(a)))
for k in range(64):
    deg = (360 * (k + .5) / 64) % 360
    if not 115 <= deg <= 140:
        faces.append((2*k, 2*k+1, 2*k+3, 2*k+2))
mesh = bpy.data.meshes.new("Pipe cut ring")
mesh.from_pydata(verts, [], faces)
mesh.update()
ring = bpy.data.objects.new("Pipe wall with conditional gap", mesh)
bpy.context.collection.objects.link(ring)
ring.data.materials.append(pipe_wall)

# Uneven brown cutaway cavity, not a detached black circular hole. It sits below
# the same pavers that settle; thin scattered grains indicate the route to the gap.
verts = [(0, 0, 0)]
for i in range(32):
    a = 2 * math.pi * i / 32
    r = random.uniform(.88, 1.09)
    verts.append((.78 * r * math.cos(a), 0, .25 * r * math.sin(a)))
faces = [(0, 1+i, 1+(i+1) % 32) for i in range(32)]
mesh = bpy.data.meshes.new("Irregular cavity face")
mesh.from_pydata(verts, [], faces)
mesh.update()
cavity = bpy.data.objects.new("Cavity example", mesh)
bpy.context.collection.objects.link(cavity)
cavity.location = (.95, -1.49, 2.53)
cavity.data.materials.append(cavity_mat)
animate_scale(cavity, [(0, (.001, .001, .001)), (16, (.001, .001, .001)),
                       (34, (1, 1, 1)), (46, (.92, 1, .8)), (60, (.92, 1, .8))])

# A handful of subtle particles, not a continuous blue hose or a fluid simulation.
for i in range(18):
    t = (i % 9) / 8
    x0 = .75 + .55 * t + random.uniform(-.06, .06)
    z0 = 2.41 - .20 * t + random.uniform(-.06, .06)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(.018, .032),
                                         location=(x0, -1.53, z0))
    grain = bpy.context.object
    grain.name = "Conditional fine particle"
    grain.data.materials.append(grain_mat if i % 3 else water_mat)
    for frame, amount, size in [(0, 0, .001), (12, 0, .001), (19, 0, 1),
                                (34, 1, 1), (39, 1, .001), (60, 1, .001)]:
        grain.location = (x0 + amount*.13, -1.53, z0 - amount*.17)
        grain.scale = (size, size, size)
        grain.keyframe_insert("location", frame=frame)
        grain.keyframe_insert("scale", frame=frame)

# Irregular, thin puddle at the depressed pavement level.
verts = [(0, 0, 0)]
for i in range(40):
    a = 2 * math.pi * i / 40
    r = 1 + .08 * math.sin(5*a) + .05 * math.sin(9*a)
    verts.append((.75*r*math.cos(a), .55*r*math.sin(a), 0))
faces = [(0, 1+i, 1+(i+1) % 40) for i in range(40)]
mesh = bpy.data.meshes.new("Puddle mesh")
mesh.from_pydata(verts, [], faces)
mesh.update()
pond = bpy.data.objects.new("Surface water on low pavers", mesh)
bpy.context.collection.objects.link(pond)
pond.location = (.9, -.22, 3.015)
pond.data.materials.append(water_mat)
animate_scale(pond, [(0, (.001, .001, .001)), (35, (.001, .001, .001)),
                     (49, (1, 1, 1)), (60, (1, 1, 1))])

# A few fine rain strokes that vanish before the cavity/settlement stage.
for i in range(35):
    x = random.uniform(-4.9, 4.9)
    z = random.uniform(3.42, 5.0)
    rain = box("Rain stroke", (x, -1.47, z), (.012, .008, .12), rain_mat)
    rain.rotation_euler[1] = .12
    animate_scale(rain, [(0, (1, 1, 1)), (15, (1, 1, 1)),
                         (22, (.001, .001, .001)), (60, (.001, .001, .001))])

sun_data = bpy.data.lights.new("Wide daylight", "AREA")
sun = bpy.data.objects.new("Wide daylight", sun_data)
bpy.context.collection.objects.link(sun)
sun.location = (-4, -5, 8)
sun.data.energy = 900
sun.data.size = 8
sun.rotation_euler = (math.radians(25), 0, math.radians(-25))
sun2_data = bpy.data.lights.new("Soft overhead", "SUN")
sun2 = bpy.data.objects.new("Soft overhead", sun2_data)
bpy.context.collection.objects.link(sun2)
sun2.data.energy = 1.5
sun2.rotation_euler = (math.radians(35), math.radians(-20), math.radians(-25))

bpy.ops.object.empty_add(location=(0, 0, 1.75))
aim = bpy.context.object
bpy.ops.object.camera_add(location=(0, -18, 5.2))
camera = bpy.context.object
camera.data.type = "ORTHO"
camera.data.ortho_scale = 11.4
track = camera.constraints.new("TRACK_TO")
track.target = aim
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"
scene.camera = camera
scene.view_settings.view_transform = "AgX"

if "--test" in sys.argv:
    test_frame = int(sys.argv[sys.argv.index("--test") + 1])
    scene.frame_set(test_frame)
    scene.render.filepath = os.path.join(OUT, "test_%03d.png" % test_frame)
    bpy.ops.render.render(write_still=True)
else:
    os.makedirs(os.path.join(OUT, "frames"), exist_ok=True)
    scene.render.filepath = os.path.join(OUT, "frames", "frame_####.png")
    bpy.ops.render.render(animation=True)

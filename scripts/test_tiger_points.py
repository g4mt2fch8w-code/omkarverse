import math
import random

random.seed(42)

points = []
normals = []
ao_list = []
w_list = []
eye_indices = []

def add_point(x, y, z, nx, ny, nz, ao=200, w=200, is_eye=False):
    idx = len(points)
    points.append((x, y, z))
    # normalize normal
    mag = math.sqrt(nx*nx + ny*ny + nz*nz)
    if mag > 1e-6:
        nx, ny, nz = nx/mag, ny/mag, nz/mag
    else:
        nx, ny, nz = 0.0, 1.0, 0.0
    normals.append((nx, ny, nz))
    ao_list.append(max(0, min(255, int(ao))))
    w_list.append(max(0, min(255, int(w))))
    if is_eye:
        eye_indices.append(idx)
    return idx

# Let's test the generator logic
print("Starting tiger point test...")

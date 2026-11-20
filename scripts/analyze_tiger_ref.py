import zlib
import struct

def read_png_rgba(filepath):
    with open(filepath, 'rb') as f:
        header = f.read(8)
        idat_chunks = []
        width = height = None
        while True:
            chunk = f.read(8)
            if not chunk or len(chunk) < 8:
                break
            length, chunk_type = struct.unpack('>I4s', chunk)
            data = f.read(length)
            crc = f.read(4)
            if chunk_type == b'IHDR':
                width, height, bit_depth, color_type, comp, filter_m, interlace = struct.unpack('>IIBBBBB', data)
            elif chunk_type == b'IDAT':
                idat_chunks.append(data)
            elif chunk_type == b'IEND':
                break
        raw_data = zlib.decompress(b''.join(idat_chunks))
        stride = width * 4
        pixels = bytearray(width * height * 4)
        prev_row = bytearray(stride)
        raw_idx = 0
        for y in range(height):
            filter_type = raw_data[raw_idx]
            raw_idx += 1
            row = bytearray(raw_data[raw_idx : raw_idx + stride])
            raw_idx += stride
            if filter_type == 1:
                for x in range(4, stride): row[x] = (row[x] + row[x - 4]) & 0xFF
            elif filter_type == 2:
                for x in range(stride): row[x] = (row[x] + prev_row[x]) & 0xFF
            elif filter_type == 3:
                for x in range(stride):
                    left = row[x - 4] if x >= 4 else 0
                    row[x] = (row[x] + ((left + prev_row[x]) >> 1)) & 0xFF
            elif filter_type == 4:
                for x in range(stride):
                    a = row[x - 4] if x >= 4 else 0
                    b = prev_row[x]
                    c = prev_row[x - 4] if x >= 4 else 0
                    p = a + b - c
                    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                    pr = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
                    row[x] = (row[x] + pr) & 0xFF
            pixels[y * stride : (y + 1) * stride] = row
            prev_row = row
        return width, height, pixels

w, h, pix = read_png_rgba('/Users/onkarbhople/.gemini/antigravity/brain/51818a2e-ef68-4503-911a-ad7b50d1ec04/.user_uploaded/media_1795196414354_002c0c02.png')

eyes = 0
stripes = 0
whites = 0
oranges = 0

for y in range(h):
    for x in range(w):
        idx = (y * w + x) * 4
        r, g, b, a = pix[idx:idx+4]
        if a < 30: continue
        if r > 245 and g > 245 and b > 245: continue # bg
        
        # Check eyes (cyan-blue in reference)
        if b > 110 and b > r + 30 and g > 70:
            eyes += 1
        elif r < 65 and g < 65 and b < 75:
            stripes += 1
        elif r > 190 and g > 190 and b > 190:
            whites += 1
        elif r > 160 and g > 70 and b < 80:
            oranges += 1

print(f"Total classified: eyes={eyes}, stripes={stripes}, whites={whites}, oranges={oranges}")

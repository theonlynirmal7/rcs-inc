from PIL import Image, ImageChops
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
image_path = os.path.join(artifacts_dir, "media__1781798805756.png")
output_dir = r"c:\Users\istha\Videos\Captures\vz RCS\public\manufacturer-logos"

os.makedirs(output_dir, exist_ok=True)

img = Image.open(image_path)

# Precise coordinates based on grid line analysis:
# Column lines are at x = 252, 441, 626
# Row lines are at y = 96, 180

# Inset values (3px) to prevent borders from showing up
col_bounds = [
    (3, 249),     # Col 0
    (257, 437),   # Col 1
    (445, 622),   # Col 2
    (631, 871)    # Col 3
]

row_bounds = [
    (3, 92),      # Row 0
    (101, 176),   # Row 1
    (185, 279)    # Row 2
]

# Mapping of (row, col) -> filename
mapping = {
    (0, 0): "giladard.png",
    (0, 1): "hanon.png",
    (0, 2): "mahle.png",
    (0, 3): "motherson.png",
    (1, 0): "sanden.png",
    (1, 1): "spal.png",
    (1, 2): "estra.png",
    (1, 3): "valeo.png",
    (2, 0): "doowon.png",
    (2, 1): "subros.png",
    (2, 2): "mahle_behr.png",
    (2, 3): "denso.png"
}

def trim(im):
    im = im.convert("RGBA")
    
    # We want to make the white/near-white background transparent.
    datas = im.getdata()
    newData = []
    for item in datas:
        # If pixel is very close to white, make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    im.putdata(newData)
    
    # Trim the transparent edges
    bg = Image.new(im.mode, im.size, im.info.get("background"))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        left = max(0, left - 4)
        top = max(0, top - 4)
        right = min(im.size[0], right + 4)
        bottom = min(im.size[1], bottom + 4)
        return im.crop((left, top, right, bottom))
    return im

for (r, c), filename in mapping.items():
    left, right = col_bounds[c]
    top, bottom = row_bounds[r]
    
    cell = img.crop((left, top, right, bottom))
    trimmed_cell = trim(cell)
    
    out_path = os.path.join(output_dir, filename)
    trimmed_cell.save(out_path, "PNG")
    print(f"Saved: {filename} to {out_path} (size={trimmed_cell.size})")

print("Precise cropping and transparent keying of 12 manufacturer brand logos complete!")

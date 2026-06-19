from PIL import Image, ImageChops
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
image_path = os.path.join(artifacts_dir, "media__1781798805756.png")
output_dir = r"c:\Users\istha\Videos\Captures\vz RCS\public\manufacturer-logos"

os.makedirs(output_dir, exist_ok=True)

img = Image.open(image_path)
width, height = img.size

# 3 rows, 4 columns
cols = 4
rows = 3

col_w = width / cols # 218.75
row_h = height / rows # 94.33

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
    # Convert to RGBA if not already
    im = im.convert("RGBA")
    
    # We want to make the background transparent.
    # The background is white (255, 255, 255).
    # Let's replace white/near-white pixels with transparent.
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
        # Add some padding around the cropped bounding box
        left, top, right, bottom = bbox
        left = max(0, left - 4)
        top = max(0, top - 4)
        right = min(im.size[0], right + 4)
        bottom = min(im.size[1], bottom + 4)
        return im.crop((left, top, right, bottom))
    return im

for (r, c), filename in mapping.items():
    # Define bounds with a 3px inset to avoid grey border lines
    left = int(c * col_w) + 3
    top = int(r * row_h) + 3
    right = int((c + 1) * col_w) - 3
    bottom = int((r + 1) * row_h) - 3
    
    cell = img.crop((left, top, right, bottom))
    trimmed_cell = trim(cell)
    
    out_path = os.path.join(output_dir, filename)
    trimmed_cell.save(out_path, "PNG")
    print(f"Saved: {filename} to {out_path} (size={trimmed_cell.size})")

print("Cropping and transparent keying of 12 manufacturer brand logos complete!")

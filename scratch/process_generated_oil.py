from PIL import Image, ImageChops
import os

generated_path = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5\ac_compressor_oil_1781800665622.png"
output_path = r"c:\Users\istha\Videos\Captures\vz RCS\public\ac-compressor-oil.png"

img = Image.open(generated_path).convert("RGBA")

# Transparent background keying (replace white/near-white pixels with transparent)
datas = img.getdata()
newData = []
for item in datas:
    # If pixel is very close to white, make it transparent
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)
img.putdata(newData)

# Trim transparent borders
bg = Image.new(img.mode, img.size, img.info.get("background"))
diff = ImageChops.difference(img, bg)
diff = ImageChops.add(diff, diff, 2.0, -100)
bbox = diff.getbbox()
if bbox:
    left, top, right, bottom = bbox
    left = max(0, left - 4)
    top = max(0, top - 4)
    right = min(img.size[0], right + 4)
    bottom = min(img.size[1], bottom + 4)
    img = img.crop((left, top, right, bottom))

img.save(output_path, "PNG")
print(f"Generated AC compressor oil image successfully processed and saved to {output_path} (size={img.size})")

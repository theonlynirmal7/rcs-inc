from PIL import Image, ImageChops
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
image_path = os.path.join(artifacts_dir, "media__1781799453359.png")
output_path = r"c:\Users\istha\Videos\Captures\vz RCS\public\manufacturer-logos\banco.png"

img = Image.open(image_path).convert("RGBA")

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
print(f"Banco logo successfully cropped, keyed, and saved to {output_path} (size={img.size})")

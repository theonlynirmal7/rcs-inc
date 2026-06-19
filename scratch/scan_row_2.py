from PIL import Image
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
image_path = os.path.join(artifacts_dir, "media__1781798805756.png")

img = Image.open(image_path)
width, height = img.size

# Let's check row 2 (y from 95 to 188)
# We can print pixel values at y=140, for x from 180 to 280
y = 140
print(f"Pixels at y={y} for x from 180 to 280:")
for x in range(180, 280):
    p = img.getpixel((x, y))
    # format pixel values
    print(f"x={x}: {p}")

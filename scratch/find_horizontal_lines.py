from PIL import Image
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
image_path = os.path.join(artifacts_dir, "media__1781798805756.png")

img = Image.open(image_path)
width, height = img.size

print("Scanning for horizontal lines...")
for x in [150, 350, 550, 750]:
    rows_at_x = []
    for y in range(height):
        p = img.getpixel((x, y))
        # Look for grey pixels (R==G==B and R between 180 and 230)
        if abs(p[0] - p[1]) < 3 and abs(p[1] - p[2]) < 3 and 180 < p[0] < 235:
            rows_at_x.append(y)
    print(f"x={x}: potential line rows: {rows_at_x}")

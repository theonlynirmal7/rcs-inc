from PIL import Image
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
image_path = os.path.join(artifacts_dir, "media__1781798805756.png")

img = Image.open(image_path)
width, height = img.size

# Let's check for vertical grid lines.
# We can scan horizontal line at y=50, y=140, y=240, and check if there are columns where R=G=B and R < 220.
# A grid line is grey, e.g. RGB(209, 209, 209) or similar.

print(f"Scanning for vertical lines across y values...")
detected_cols = {}
for y in [45, 140, 235]:
    cols_at_y = []
    for x in range(width):
        p = img.getpixel((x, y))
        # Look for grey pixels (R==G==B and R between 180 and 230)
        if abs(p[0] - p[1]) < 3 and abs(p[1] - p[2]) < 3 and 180 < p[0] < 235:
            cols_at_y.append(x)
    print(f"y={y}: potential line columns: {cols_at_y}")

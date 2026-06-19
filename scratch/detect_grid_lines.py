from PIL import Image
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
image_path = os.path.join(artifacts_dir, "media__1781798805756.png")

img = Image.open(image_path)
width, height = img.size

# Let's find vertical lines by looking at columns that have a lot of grey pixels.
# A grey pixel might be where R == G == B and R < 240 and R > 150.
# Or we can just print the pixels around the division points to see where the grid lines are.

print(f"Image dimensions: {width}x{height}")

# Let's inspect rows around y=94 and y=189
# And columns around x=219, 438, 656

print("Vertical divisions analysis:")
for test_x in [218, 219, 220, 250, 437, 438, 439, 655, 656, 657]:
    # Check pixels along this x column
    grey_count = 0
    for y in range(height):
        p = img.getpixel((test_x, y))
        # if pixel is grey/dark (like the border lines)
        if p[0] < 230 and abs(p[0]-p[1]) < 5 and abs(p[1]-p[2]) < 5:
            grey_count += 1
    print(f"x={test_x}: grey pixels count = {grey_count} / {height}")

print("Horizontal divisions analysis:")
for test_y in [93, 94, 95, 188, 189, 190]:
    grey_count = 0
    for x in range(width):
        p = img.getpixel((x, test_y))
        if p[0] < 230 and abs(p[0]-p[1]) < 5 and abs(p[1]-p[2]) < 5:
            grey_count += 1
    print(f"y={test_y}: grey pixels count = {grey_count} / {width}")

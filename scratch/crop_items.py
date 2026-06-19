import os
import math
from PIL import Image

# Setup directories
output_dir = os.path.join(os.path.dirname(__file__), "../public")
input_img_path = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5\media__1781777912224.png"

img = Image.open(input_img_path)
width, height = img.size
print(f"Image dimensions: {width}x{height}")

# Grid layout: 3 rows, 6 columns
cols = 6
rows = 3
card_width = width / cols
card_height = height / rows
print(f"Grid card dimensions: {card_width:.2f} x {card_height:.2f}")

# Define the new items to extract (only the ones not already in database)
new_items = [
  {"name": "Hose Suction", "file": "hose-suction.png", "row": 0, "col": 0},
  {"name": "AC Compressor Oil", "file": "ac-compressor-oil.png", "row": 0, "col": 1},
  {"name": "Air Vent", "file": "air-vent.png", "row": 0, "col": 2},
  {"name": "Air Duct", "file": "air-duct.png", "row": 0, "col": 3},
  {"name": "AC Repair Kit", "file": "ac-repair-kit.png", "row": 0, "col": 4},
  {"name": "Cabin Temperature Sensor", "file": "cabin-temperature-sensor.png", "row": 1, "col": 0},
  {"name": "Defroster Hose", "file": "defroster-hose.png", "row": 1, "col": 1},
  {"name": "Hose Discharge", "file": "hose-discharge.png", "row": 1, "col": 2},
  {"name": "HVAC Hose", "file": "hvac-hose.png", "row": 1, "col": 3},
  {"name": "Heat Exchange", "file": "heat-exchange.png", "row": 1, "col": 4},
  {"name": "V Belt", "file": "v-belt.png", "row": 2, "col": 0}
]

def clean_bg_and_save(cropped_img, dest_path, threshold=20, feather=10):
    rgba_img = cropped_img.convert("RGBA")
    datas = rgba_img.getdata()
    newData = []
    
    for item in datas:
        r, g, b, a = item
        # Distance to pure white
        dist = math.sqrt((r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2)
        
        if dist < threshold:
            newData.append((r, g, b, 0))
        elif dist < threshold + feather:
            ratio = (dist - threshold) / feather
            newData.append((r, g, b, int(255 * ratio)))
        else:
            newData.append((r, g, b, 255))
            
    rgba_img.putdata(newData)
    rgba_img.save(dest_path, "PNG")

print("Processing items grid cropping...")
for item in new_items:
    c = item["col"]
    r = item["row"]
    
    # Calculate bounding box (top 70% of card to exclude labels)
    x0 = int(c * card_width)
    y0 = int(r * card_height) + 5
    x1 = int((c + 1) * card_width)
    y1 = int(r * card_height + (card_height * 0.70))
    
    print(f"Cropping {item['name']} from box ({x0}, {y0}) -> ({x1}, {y1})")
    
    cropped = img.crop((x0, y0, x1, y1))
    
    # Save with transparent background
    dest_path = os.path.join(output_dir, item["file"])
    clean_bg_and_save(cropped, dest_path)
    print(f"[OK] Saved: {item['file']}")

print("All new items cropped successfully.")

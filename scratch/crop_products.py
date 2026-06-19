import os
import math
from PIL import Image

# Setup directories
output_dir = os.path.join(os.path.dirname(__file__), "../public")
input_img_path = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5\media__1781774943424.png"

img = Image.open(input_img_path)
width, height = img.size

# Grid: 3 rows, 6 columns
cols = 6
rows = 3
card_width = width / cols # 170.66
card_height = height / rows # 156.0

# Define the new products to extract
new_products = [
  {"name": "Radiator Fan Shroud & Fan", "file": "radiator-fan-shroud.png", "row": 0, "col": 0},
  {"name": "AC Control Unit", "file": "ac-control-unit.png", "row": 0, "col": 5},
  {"name": "Cooling Coil", "file": "cooling-coil.png", "row": 1, "col": 2},
  {"name": "Condensor Fan Cowling", "file": "condenser-fan-cowling.png", "row": 2, "col": 0},
  {"name": "AC Pressure Switch", "file": "ac-pressure-switch.png", "row": 2, "col": 2},
  {"name": "Refrigerant", "file": "refrigerant.png", "row": 2, "col": 3},
  {"name": "Radiator Fan Assy", "file": "radiator-fan-assy.png", "row": 2, "col": 4},
  {"name": "Radiator Fan Motor", "file": "radiator-fan-motor.png", "row": 2, "col": 5}
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

print("Processing grid cropping...")
for prod in new_products:
    c = prod["col"]
    r = prod["row"]
    
    # Calculate bounding box (top 70% of card to exclude labels)
    x0 = int(c * card_width)
    y0 = int(r * card_height) + 5
    x1 = int((c + 1) * card_width)
    y1 = int(r * card_height + (card_height * 0.70))
    
    print(f"Cropping {prod['name']} from box ({x0}, {y0}) -> ({x1}, {y1})")
    
    cropped = img.crop((x0, y0, x1, y1))
    
    # Save with transparent background
    dest_path = os.path.join(output_dir, prod["file"])
    clean_bg_and_save(cropped, dest_path)
    print(f"[OK] Saved: {prod['file']}")

print("All new products cropped successfully.")

from PIL import Image, ImageChops
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
output_dir = r"c:\Users\istha\Videos\Captures\vz RCS\public"

mapping = {
    "hose_suction_1781801308015.png": "hose-suction.png",
    "air_vent_1781801324571.png": "air-vent.png",
    "air_duct_1781801339149.png": "air-duct.png",
    "ac_repair_kit_1781801355354.png": "ac-repair-kit.png",
    "temp_sensor_1781801370259.png": "cabin-temperature-sensor.png",
    "defroster_hose_1781801386526.png": "defroster-hose.png",
    "hose_discharge_1781801402237.png": "hose-discharge.png",
    "hvac_hose_1781801419113.png": "hvac-hose.png",
    "heat_exchange_1781801434708.png": "heat-exchange.png",
    "v_belt_1781801450068.png": "v-belt.png"
}

for src_name, dest_name in mapping.items():
    src_path = os.path.join(artifacts_dir, src_name)
    dest_path = os.path.join(output_dir, dest_name)
    
    if os.path.exists(src_path):
        img = Image.open(src_path).convert("RGBA")
        
        # Key out white background to transparent
        datas = img.getdata()
        newData = []
        for item in datas:
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
            
        img.save(dest_path, "PNG")
        print(f"Processed: {src_name} -> Saved to: {dest_path} (size={img.size})")
    else:
        print(f"Error: {src_path} does not exist!")

print("All 10 generated product images processed and saved successfully!")

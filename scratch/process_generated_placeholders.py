from PIL import Image, ImageChops
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
output_dir = r"c:\Users\istha\Videos\Captures\vz RCS\public"

mapping = {
    "truck_compressor_1781800791396.png": "truck-compressor.png",
    "bus_expansion_valve_1781800807672.png": "bus-expansion-valve.png",
    "bus_condenser_coil_1781800822671.png": "bus-condenser-coil.png",
    "magnetic_clutch_1781800836172.png": "magnetic-clutch.png",
    "bus_blower_assembly_1781800849997.png": "bus-blower-assembly.png"
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

print("All generated product images processed and saved successfully!")

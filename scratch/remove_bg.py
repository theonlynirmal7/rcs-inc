import os
from PIL import Image, ImageFilter
import math

def remove_background(input_path, output_path, threshold=20, feather=15):
    # Load image
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Get reference background color from top-left corner (pixel at 5, 5)
    bg_r, bg_g, bg_b, _ = img.getpixel((5, 5))
    print(f"Detected background color: RGB({bg_r}, {bg_g}, {bg_b})")
    
    # We also want to treat any near-white pixels (like 255,255,255) as background
    target_bg_colors = [(bg_r, bg_g, bg_b), (255, 255, 255)]
    
    datas = img.getdata()
    newData = []
    
    for item in datas:
        r, g, b, a = item
        
        # Calculate minimum distance to any target background color
        min_dist = 999.0
        for target in target_bg_colors:
            tr, tg, tb = target
            dist = math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2)
            if dist < min_dist:
                min_dist = dist
                
        if min_dist < threshold:
            # Fully transparent
            newData.append((r, g, b, 0))
        elif min_dist < threshold + feather:
            # Feathered transparency transition
            ratio = (min_dist - threshold) / feather
            alpha = int(255 * ratio)
            newData.append((r, g, b, alpha))
        else:
            # Keep original
            newData.append((r, g, b, 255))
            
    img.putdata(newData)
    
    # Save the result
    img.save(output_path, "PNG")
    print(f"Saved clean transparent image to: {output_path}")

# Paths
input_img = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5\media__1781777323232.png"
output_img = r"c:\Users\istha\Videos\Captures\vz RCS\public\radiator-cooling-fan.png"

remove_background(input_img, output_img, threshold=20, feather=15)

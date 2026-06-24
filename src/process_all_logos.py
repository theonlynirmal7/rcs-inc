import os
from PIL import Image, ImageOps

base_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"
dest_dir = r"c:\Users\istha\Videos\Captures\vz RCS\public\manufacturer-logos"

os.makedirs(dest_dir, exist_ok=True)

# 1. Process Zilax (Cardboard Box Image)
zilax_src = os.path.join(base_dir, "media__1782033442229.jpg")
if os.path.exists(zilax_src):
    img = Image.open(zilax_src)
    
    # Use pure Pillow to get bounding box
    gray = img.convert("L")
    crop_box = (70, 220, 950, 650)
    central = gray.crop(crop_box)
    
    # Invert to make background dark and logo bright
    inverted = ImageOps.invert(central)
    
    # Threshold: anything above 120 in inverted becomes 255 (logo), else 0 (background)
    thresholded = inverted.point(lambda p: 255 if p > 120 else 0)
    
    bbox = thresholded.getbbox()
    if bbox:
        x0 = crop_box[0] + bbox[0]
        y0 = crop_box[1] + bbox[1]
        x1 = crop_box[0] + bbox[2]
        y1 = crop_box[1] + bbox[3]
        
        # Add padding
        padding = 20
        x0 = max(0, x0 - padding)
        y0 = max(0, y0 - padding)
        x1 = min(img.width, x1 + padding)
        y1 = min(img.height, y1 + padding)
        
        cropped = img.crop((x0, y0, x1, y1))
        
        # Make transparent with solid logo colors
        cropped_rgba = cropped.convert("RGBA")
        data = cropped_rgba.getdata()
        new_data = []
        
        # We will use a soft threshold around 140
        low_thresh = 95
        high_thresh = 145
        
        for item in data:
            r, g, b, a = item
            gray_val = int(0.299 * r + 0.587 * g + 0.114 * b)
            
            if gray_val > high_thresh:
                new_data.append((255, 255, 255, 0)) # transparent background
            elif gray_val < low_thresh:
                # Fully solid dark grey/black logo color
                new_data.append((26, 26, 26, 255))
            else:
                # Interpolate alpha smoothly for anti-aliasing
                alpha = int(255 * (1 - (gray_val - low_thresh) / (high_thresh - low_thresh)))
                alpha = max(0, min(255, alpha))
                new_data.append((26, 26, 26, alpha))
                
        cropped_rgba.putdata(new_data)
        cropped_rgba.save(os.path.join(dest_dir, "zilax.png"), "PNG")
        print("Zilax processed successfully!")
    else:
        print("Zilax: No bounding box detected.")
else:
    print("Zilax source not found.")

# 2. Process Value (RGB Image with white background)
value_src = os.path.join(base_dir, "media__1782033456253.jpg")
if os.path.exists(value_src):
    img = Image.open(value_src)
    # Convert white background to transparent
    img_rgba = img.convert("RGBA")
    data = img_rgba.getdata()
    new_data = []
    for item in data:
        r, g, b, a = item
        # If it is white/near-white, make it transparent
        if r > 235 and g > 235 and b > 235:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append((r, g, b, 255))
    img_rgba.putdata(new_data)
    img_rgba.save(os.path.join(dest_dir, "value.png"), "PNG")
    print("Value processed successfully!")

# 3. Process BPI
bpi_src = os.path.join(base_dir, "media__1782033468545.png")
if os.path.exists(bpi_src):
    img = Image.open(bpi_src)
    img.save(os.path.join(dest_dir, "bpi.png"), "PNG")
    print("BPI saved successfully!")

# 4. Process Vika
vika_src = os.path.join(base_dir, "media__1782033478629.png")
if os.path.exists(vika_src):
    img = Image.open(vika_src)
    img.save(os.path.join(dest_dir, "vika.png"), "PNG")
    print("Vika saved successfully!")

# 5. Process Pasio
pasio_src = os.path.join(base_dir, "media__1782033485924.png")
if os.path.exists(pasio_src):
    img = Image.open(pasio_src)
    img.save(os.path.join(dest_dir, "pasio.png"), "PNG")
    print("Pasio saved successfully!")

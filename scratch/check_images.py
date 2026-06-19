from PIL import Image
import os

artifacts_dir = r"C:\Users\istha\.gemini\antigravity\brain\cf8c62c8-54bc-4a4d-9fca-aba4ac3424a5"

for f in ["media__1781798628798.png", "media__1781798805756.png"]:
    p = os.path.join(artifacts_dir, f)
    if os.path.exists(p):
        img = Image.open(p)
        print(f"{f}: size={img.size}, mode={img.mode}")
    else:
        print(f"{f} not found at {p}")

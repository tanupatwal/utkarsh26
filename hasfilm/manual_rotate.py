import os
from PIL import Image

# We will read from the already optimized WebP files in public/assets/team
# because they are the ones being used. We just need to rotate them.
ASSETS_DIR = "/Users/adityapaswan/soup/projects/utkarsh26/hasfilm/public/assets/team"

TO_FIX = [
    "ags-amphitheatre-mahima.webp",
    "ags-non-tech-nikhil.webp",
    "ags-rajeshwari.webp",
    "ags-media-sahitya.webp"
]

def rotate_images():
    for f in TO_FIX:
        file_path = os.path.join(ASSETS_DIR, f)
        
        if not os.path.exists(file_path):
            print(f"File not found: {f}")
            continue

        try:
            with Image.open(file_path) as img:
                # Rotate -90 (270) degrees - strict rotation
                # This is a guess: usually sideways images need -90 or 90. 
                # Let's try -90 (counter-clockwise) which stands upright for "left-side down" phones
                # Actually, standard PIL rotate is counter-clockwise. 
                # If they are lying on left side, we need -90 (270).
                # Let's try 270 (which is -90). 
                
                # Update: User just said "turned". 
                # I'll try rotating them 270 degrees (clockwise 90).
                rotated = img.rotate(270, expand=True) 
                
                rotated.save(file_path, 'WEBP', quality=90)
                print(f"Rotated {f} by -90 degrees (270 CCW)")
                
        except Exception as e:
            print(f"Error processing {f}: {e}")

if __name__ == "__main__":
    rotate_images()

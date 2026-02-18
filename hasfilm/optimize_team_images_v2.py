import os
from PIL import Image, ImageOps

# Source is the original high-res folder
SOURCE_DIR = "/Users/adityapaswan/soup/projects/utkarsh26/final-images/team"
# Destination is the public assets folder
DEST_DIR = "/Users/adityapaswan/soup/projects/utkarsh26/hasfilm/public/assets/team"

MAX_WIDTH = 1000
QUALITY = 85

def optimize_images():
    # Ensure dest exists
    os.makedirs(DEST_DIR, exist_ok=True)

    # Filter for source image types
    files = [f for f in os.listdir(SOURCE_DIR) if not f.startswith('.') and f.lower().endswith(('.jpg', '.jpeg', '.png', '.JPG'))]
    
    print(f"Found {len(files)} images to fix and optimize from source...")
    
    for f in files:
        file_path = os.path.join(SOURCE_DIR, f)
        base_name, _ = os.path.splitext(f)
        output_path = os.path.join(DEST_DIR, f"{base_name}.webp")
        
        try:
            with Image.open(file_path) as img:
                # Fix orientation from EXIF
                img = ImageOps.exif_transpose(img)

                # Resize if too large
                if img.width > MAX_WIDTH:
                    ratio = MAX_WIDTH / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                
                # Save as WebP
                img.save(output_path, 'WEBP', quality=QUALITY)
                print(f"Fixed & Optimized: {f} -> {base_name}.webp")
            
        except Exception as e:
            print(f"Error processing {f}: {e}")

if __name__ == "__main__":
    optimize_images()

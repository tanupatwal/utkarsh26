import os
from PIL import Image
import shutil

SOURCE_DIR = "/Users/adityapaswan/soup/projects/utkarsh26/final-images/events"
DEST_DIR = "/Users/adityapaswan/soup/projects/utkarsh26/hasfilm/public/assets/highlights"

valid_extensions = {".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"}

def process_images():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    files = [f for f in os.listdir(SOURCE_DIR) if os.path.splitext(f)[1] in valid_extensions]
    files.sort()  # Ensure consistent order

    print(f"Found {len(files)} images to process.")

    for i, filename in enumerate(files, start=1):
        source_path = os.path.join(SOURCE_DIR, filename)
        dest_filename = f"{i}.webp"
        dest_path = os.path.join(DEST_DIR, dest_filename)

        try:
            with Image.open(source_path) as img:
                print(f"Converting {filename} to {dest_filename}...")
                img.save(dest_path, "WEBP", quality=85)
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    process_images()

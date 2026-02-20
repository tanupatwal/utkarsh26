import os
from PIL import Image, ExifTags

DIR = "/Users/adityapaswan/soup/projects/utkarsh26/hasfilm/public/assets/team/new"
valid_extensions = {".jpg", ".jpeg", ".png", ".webp"}

def fix_orientation(img):
    try:
        exif = img._getexif()
        if exif:
            for tag, value in exif.items():
                if ExifTags.TAGS.get(tag) == "Orientation":
                    if value == 3:
                        img = img.rotate(180, expand=True)
                    elif value == 6:
                        img = img.rotate(270, expand=True)
                    elif value == 8:
                        img = img.rotate(90, expand=True)
                    break
    except (AttributeError, KeyError):
        pass
    return img

def optimize():
    files = [f for f in os.listdir(DIR) if os.path.splitext(f)[1].lower() in valid_extensions]
    files.sort()
    print(f"Found {len(files)} images to optimize.")

    for filename in files:
        source_path = os.path.join(DIR, filename)
        base_name = os.path.splitext(filename)[0]
        dest_path = os.path.join(DIR, f"{base_name}.webp")

        try:
            with Image.open(source_path) as img:
                img = fix_orientation(img)
                # Resize if too large (max 800px on longest side for team photos)
                max_dim = 800
                if max(img.size) > max_dim:
                    ratio = max_dim / max(img.size)
                    new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
                    img = img.resize(new_size, Image.LANCZOS)
                
                img.save(dest_path, "WEBP", quality=80)
                new_size_kb = os.path.getsize(dest_path) / 1024
                old_size_kb = os.path.getsize(source_path) / 1024
                print(f"  {filename} ({old_size_kb:.0f}KB) -> {base_name}.webp ({new_size_kb:.0f}KB)")

                # Remove original if it's not already .webp
                if source_path != dest_path:
                    os.remove(source_path)
        except Exception as e:
            print(f"  ERROR: {filename}: {e}")

    remaining = os.listdir(DIR)
    print(f"\nDone! {len(remaining)} files in folder.")

if __name__ == "__main__":
    optimize()

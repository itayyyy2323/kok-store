import os
import json
from rembg import remove
from PIL import Image

input_dir = r"C:\Users\Itay.DESKTOP-5V1BTT5\Documents\pic for website"
output_dir = r"public\images"
json_path = r"data\products.json"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Read products.json
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Track which images we convert to PNG
converted_files = set()

print(f"Processing images from {input_dir}...")
for filename in os.listdir(input_dir):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        input_path = os.path.join(input_dir, filename)
        
        # New filename should be .png
        base_name = os.path.splitext(filename)[0]
        new_filename = f"{base_name}.png"
        output_path = os.path.join(output_dir, new_filename)
        
        try:
            print(f"Removing background for {filename}...")
            with open(input_path, 'rb') as i:
                input_data = i.read()
                
            output_data = remove(input_data)
            
            with open(output_path, 'wb') as o:
                o.write(output_data)
                
            converted_files.add(base_name)
            print(f"Saved to {output_path}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

# Update products.json to point to .png for converted files
print("Updating products.json...")
updated_count = 0
for product in products:
    if "images" in product and product["images"]:
        current_img = product["images"][0]
        base_name = os.path.splitext(current_img)[0]
        
        if base_name in converted_files:
            product["images"][0] = f"{base_name}.png"
            updated_count += 1

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Done! Updated {updated_count} references in products.json.")

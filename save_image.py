import base64
import os

# This will be replaced with actual image data
image_data = None

# For now, let's copy from the attachment if available
import shutil

# Try to find the image in common locations
possible_paths = [
    r"C:\Users\Aryan Kota\AppData\Local\Temp",
    r"C:\Users\Aryan Kota\Downloads",
    r"C:\Users\Aryan Kota\Desktop"
]

print("Please manually copy your profile image to:")
print(r"c:\Users\Aryan Kota\Desktop\project 47\portfolio-flask\static\images\profile.jpg")
print("\nThe image should be the one with the red jacket from the attachment.")

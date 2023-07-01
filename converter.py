from PIL import Image
import numpy as np

# Open the image file
img = Image.open('C:/Users/595-424-424 Windows/Desktop/test.png').convert('L')  # Convert image to grayscale
img = img.resize((80, 40), Image.ANTIALIAS)  # Resize image

# Convert image data to a numpy array
img_array = np.array(img)

# Normalize to 0 - 1
img_array = img_array / 255

# Convert float array to binary array
binary_array = np.where(img_array > 0.5, 1, 0)

# Flatten the 2D array to 1D
flat_array = binary_array.flatten()

# Save to text file
np.savetxt('C:/Users/595-424-424 Windows/Desktop/array.txt', flat_array[None], fmt='%d', delimiter=',')  # replace path with your preferred path

print('Array saved to array.txt')

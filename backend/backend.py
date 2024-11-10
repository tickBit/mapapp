from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)

WATER = [170, 211, 223, 255]
FOREST = [170, 203, 175, 255]
RESIDENTIAL = [213, 213, 214, 255]

CLASSES = ["Water", "Forest", "Residential"]

TOLERANCE = 5

def is_color(pixel, color, tolerance=TOLERANCE):
    return all(abs(pixel[i] - color[i]) <= tolerance for i in range(3))  # comparision of RGB components

def calculate_land_percentage(img):

    pixels = np.array(img)

    total_pixels = pixels.shape[0] * pixels.shape[1]
    water_pixels = 0
    forest_pixels = 0
    residential_pixels = 0

    for row in pixels:
        for pixel in row:
            if is_color(pixel, WATER):
                water_pixels += 1
            elif is_color(pixel, FOREST):
                forest_pixels += 1
            elif is_color(pixel, RESIDENTIAL):
                residential_pixels += 1

    water_percentage = (water_pixels / total_pixels) * 100
    forest_percentage = (forest_pixels / total_pixels) * 100
    residential_percentage = (residential_pixels / total_pixels) * 100

    return [water_percentage, forest_percentage, residential_percentage]


@app.route('/predict', methods=['POST'])
def predict():
    
    data = request.get_json()
    img_data = data['image']
    
    img_data = img_data.split(',')[1]
    
    img_bytes = BytesIO(base64.b64decode(img_data))
    img = Image.open(img_bytes)
    
    percentages = calculate_land_percentage(img)

    print("Percentage of water:", percentages[0])
    print("Percentage of forest:", percentages[1])
    print("Percentage of residential:", percentages[2])

    return jsonify({"prediction": CLASSES[np.argmax(percentages)]})

if __name__ == '__main__':
    app.run(debug=True)

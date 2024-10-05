from flask import Flask, jsonify, request
import tempfile
import os
import base64
import mss
import cv2
import numpy as np
from PIL import Image
import pytesseract
import io  # Ensure io is imported for handling byte streams

app = Flask(__name__)

@app.route('/perform_ocr', methods=['POST'])
def perform_ocr():
    data = request.get_json()
    image_data = data.get('image_path')

    try:
        if not image_data:
            return jsonify({"error": "No image data provided"}), 400

        # Decode the base64 image
        header, encoded = image_data.split(",", 1)  # Split the Data URL
        decoded = base64.b64decode(encoded)  # Decode the base64

        # Load the image from the decoded data
        img = Image.open(io.BytesIO(decoded))  # Convert to a PIL image
        print(f"Received image mode: {img.mode}, Size: {img.size}")

        # Convert to grayscale for better OCR results
        img = img.convert('L')

        # Optionally apply a threshold
        img = img.point(lambda x: 0 if x < 128 else 255, '1')

        # Perform OCR
        extracted_text = pytesseract.image_to_string(img, lang='eng')  # Specify language

        print(f"Extracted text: {extracted_text}")  # Log extracted text

        if not extracted_text.strip():  # Check if OCR returned empty text
            return jsonify({"error": "OCR returned empty text"}), 400
        
        return jsonify({"extracted_text": extracted_text}), 200
    
    except Exception as e:
        print(f"Error during OCR: {e}")
        return jsonify({"error": str(e)}), 500


# Other routes remain unchanged
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

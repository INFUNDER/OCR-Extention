# OCR-Extension

This project is a Chrome extension that allows users to capture a portion of their screen, select an area, and perform Optical Character Recognition (OCR) on the selected image using Tesseract OCR.

## Features

- Capture the visible tab of the Chrome browser.
- Select a portion of the captured image.
- Perform OCR on the selected area.
- Display the extracted text in the extension popup.

## Technologies Used

- **HTML/CSS**: For the user interface of the Chrome extension.
- **JavaScript**: For the frontend functionality of the extension.
- **Python**: For the backend server that handles OCR processing.
- **Flask**: A lightweight Python web framework to build the backend.
- **Tesseract OCR**: An open-source OCR engine to extract text from images.

## Installation

### Prerequisites

- Python 3.x installed on your machine.
- Tesseract OCR installed. You can find the installation instructions [here](https://github.com/tesseract-ocr/tesseract).

### Clone the Repository

```bash
git clone https://github.com/yourusername/OCR-Extension.git
cd OCR-Extension

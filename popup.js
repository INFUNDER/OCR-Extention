let canvas = document.getElementById('screenshot-canvas');
let ctx = canvas.getContext('2d');
let startX, startY, endX, endY, isSelecting = false;
let img;  // Store the original image to redraw it
let scale = 1; // Scale factor for the image

// Capture button event
document.getElementById('capture-btn').addEventListener('click', () => {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, (imageUri) => {
    img = new Image();  // Create a new image
    img.src = imageUri; // Set the source to the captured image

    img.onload = () => {
      // Set canvas dimensions to match the original image
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear the canvas and draw the image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);  // Draw the image on the canvas

      // Show the canvas and OCR button
      canvas.style.display = 'block'; 
      document.getElementById('ocr-btn').style.display = 'inline'; 

      // Setup mouse events for cropping
      setupCropping();
    };
  });
});

// Setup cropping functionality
function setupCropping() {
  canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    isSelecting = true;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isSelecting) {
      endX = e.offsetX;
      endY = e.offsetY;
      drawSelection(); // Redraw selection rectangle
    }
  });

  canvas.addEventListener('mouseup', () => {
    isSelecting = false;
    performOCR(); // Perform OCR when the user releases the mouse
  });
}

// Draw the selection rectangle on the canvas
function drawSelection() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.drawImage(img, 0, 0); // Redraw the original image
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, endX - startX, endY - startY); // Draw selection rectangle
}

// Perform OCR on the selected portion
function performOCR() {
  const width = endX - startX;
  const height = endY - startY;

  // Validate the selection
  if (width <= 0 || height <= 0) {
    alert('Please select a valid region.');
    return;
  }

  const imageData = ctx.getImageData(startX, startY, width, height);
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = width;
  croppedCanvas.height = height;
  const croppedCtx = croppedCanvas.getContext('2d');
  croppedCtx.putImageData(imageData, 0, 0);

  // Convert to Data URL
  const croppedImageUri = croppedCanvas.toDataURL('image/png');

  // Log the Data URL for debugging
  console.log("Sending image data to OCR:", croppedImageUri);

  // Send the cropped image to the backend for OCR
  fetch('http://192.168.1.81:5001/perform_ocr', { // Update with the correct IP
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image_path: croppedImageUri })
  })
  .then(response => response.json())
  .then(data => {
    if (data.extracted_text) {
      document.getElementById('result').innerText = data.extracted_text; // Display the extracted text
    } else {
      alert('Error performing OCR: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Failed to perform OCR');
  });
}

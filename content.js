function createCropOverlay() {
    console.log("Cropping overlay is being created..."); // Add this log
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'crosshair';
    document.body.appendChild(overlay);
  
    let startX, startY, cropArea;
  
    overlay.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
  
      cropArea = document.createElement('div');
      cropArea.style.position = 'absolute';
      cropArea.style.border = '2px dashed #FFF';
      cropArea.style.zIndex = '10000';
      document.body.appendChild(cropArea);
    });
  
    document.addEventListener('mousemove', (e) => {
      if (cropArea) {
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        cropArea.style.left = `${startX}px`;
        cropArea.style.top = `${startY}px`;
        cropArea.style.width = `${width}px`;
        cropArea.style.height = `${height}px`;
      }
    });
  
    document.addEventListener('mouseup', (e) => {
      if (cropArea) {
        const endX = e.clientX;
        const endY = e.clientY;
        overlay.remove();
        cropArea.remove();
        console.log(`Selected region: StartX=${startX}, StartY=${startY}, Width=${endX - startX}, Height=${endY - startY}`);
        extractSelectedRegion(startX, startY, endX - startX, endY - startY);
      }
    });
  }
  


  function extractSelectedRegion(x, y, width, height) {
    console.log(`Extracting region X=${x}, Y=${y}, Width=${width}, Height=${height}`);
    
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (imageUri) => {
      if (!imageUri) {
        console.error('Failed to capture tab.');
        return;
      }
      
      console.log('Image captured, performing cropping...');
      const img = new Image();
      img.src = imageUri;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        const croppedImage = canvas.toDataURL('image/png');
  
        // Log the cropped image to ensure it's generated
        console.log("Cropped Image Data:", croppedImage);
        performOCR(croppedImage);
      };
    });
  }
  
  function performOCR(imageUri) {
    console.log("Performing OCR...");
    Tesseract.recognize(imageUri, 'eng')
      .then(result => {
        const text = result.data.text;
        console.log("OCR Result:", text);
        navigator.clipboard.writeText(text);
        alert("OCR Text copied: " + text);
      })
      .catch(error => {
        console.error('OCR failed: ', error);
      });
  }
  
  // Inside content.js or popup.js, include the local Tesseract.js
const script = document.createElement('script');
script.src = chrome.runtime.getURL('libs/tesseract.min.js');
document.head.appendChild(script);

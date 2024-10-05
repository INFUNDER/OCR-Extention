// This function creates the cropping overlay but no longer captures the tab
function createCropOverlay() {
  console.log("Cropping overlay is being created...");

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

  // Start cropping when the user clicks and drags
  overlay.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;

    cropArea = document.createElement('div');
    cropArea.style.position = 'absolute';
    cropArea.style.border = '2px dashed #FFF';
    cropArea.style.zIndex = '10000';
    document.body.appendChild(cropArea);
  });

  // Track the movement of the mouse to define the crop area
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

  // End cropping when the mouse is released
  document.addEventListener('mouseup', (e) => {
    if (cropArea) {
      const endX = e.clientX;
      const endY = e.clientY;
      overlay.remove();
      cropArea.remove();
      console.log(`Selected region: StartX=${startX}, StartY=${startY}, Width=${endX - startX}, Height=${endY - startY}`);
      // Process cropping or other interactions here.
    }
  });
}

import mss
import numpy as np
import cv2

# Create an instance of MSS
with mss.mss() as sct:
    # Grab the screen
    monitor = sct.monitors[1]  # 1 for the primary monitor
    screenshot = sct.grab(monitor)
    
    # Convert the screenshot to a NumPy array
    screenshot_np = np.array(screenshot)
    image = cv2.cvtColor(screenshot_np, cv2.COLOR_BGRA2BGR)  # Convert from BGRA to BGR

    # Display the image
    cv2.imshow("Screenshot", image)
    cv2.waitKey(0)  # Wait until a key is pressed
    cv2.destroyAllWindows()  # Close the window

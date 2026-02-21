/**
 * Image Processing Utilities
 * Contains logic for canvas manipulation, API fetching, and file conversions
 * decoupled from the React lifecycle functions.
 */
import { BACKEND_URL } from '../constants/packages';

/**
 * Helper to asynchronously load an image from a URL or Blob.
 * Used primarily before painting an uploaded file onto a Canvas.
 */
export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        // Ensures cross-origin images (if any) can be drawn onto a canvas without tainting it
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

/**
 * Takes an original image source and cropped area coordinates,
 * then draws the specific cropped portion onto an invisible HTML5 Canvas.
 * Finally, returns it as a Blob and a new URL.
 */
export async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Set canvas to the exact size of the user's cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw only the cropped portion of the image onto the canvas
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // Convert canvas contents into a JPEG Blob string file format
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const fileUrl = URL.createObjectURL(blob);
            resolve({ blob, fileUrl });
        }, 'image/jpeg');
    });
}

/**
 * Sends a file and desired background hex color to the Python FastAPI backend
 * running on Hugging Face Spaces. It returns the processed image Blob.
 */
export async function removeBackgroundAPI(file, bgColor) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("color", bgColor);

    const response = await fetch(`${BACKEND_URL}/remove-bg`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
    }

    return await response.blob();
}

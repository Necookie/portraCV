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

    // --- CLIENT-SIDE PERFORMANCE OPTIMIZATION ---
    // Caps the physical dimensions of the image uploaded to the backend to drastically reduce latency
    const MAX_DIMENSION = 800;

    // Calculate aspect-preserving output dimensions
    let outputWidth = pixelCrop.width;
    let outputHeight = pixelCrop.height;

    // If the crop area from the raw camera is extremely high-res, scale it down proportionally
    if (outputWidth > MAX_DIMENSION || outputHeight > MAX_DIMENSION) {
        if (outputWidth > outputHeight) {
            outputHeight = Math.round((outputHeight * MAX_DIMENSION) / outputWidth);
            outputWidth = MAX_DIMENSION;
        } else {
            outputWidth = Math.round((outputWidth * MAX_DIMENSION) / outputHeight);
            outputHeight = MAX_DIMENSION;
        }
    }

    // Set canvas to the dynamically downscaled size
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Extract the precise chunk from the massive raw image and paint it squished into our optimized canvas
    ctx.drawImage(
        image,
        pixelCrop.x,             // Source anchor X
        pixelCrop.y,             // Source anchor Y
        pixelCrop.width,         // Source chunk width
        pixelCrop.height,        // Source chunk height
        0, 0,                    // Output canvas anchor
        outputWidth,             // Output stretched width
        outputHeight             // Output stretched height
    );

    // Convert canvas contents into a compressed JPEG Blob (forcing 0.80 lossy quality instead of 0.92 default)
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const fileUrl = URL.createObjectURL(blob);
            resolve({ blob, fileUrl });
        }, 'image/jpeg', 0.80);
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

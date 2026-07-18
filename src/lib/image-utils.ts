/**
 * Utility to compress an image file client-side using HTML5 Canvas.
 * Resizes the image to a maximum width/height and compresses to JPEG or PNG.
 * Bypasses GIF files to preserve animations.
 */
export function compressImage(file: File, maxDim = 1000, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    // Only compress standard images (JPEG, PNG, WebP)
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to target mime type (prefer jpeg for photos to optimize size)
        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            const extension = outputType === "image/png" ? ".png" : ".jpg";
            const newName = file.name.replace(/\.[^.]+$/, "") + extension;
            const compressedFile = new File([blob], newName, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

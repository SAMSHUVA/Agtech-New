const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load selected image.'));
    image.src = src;
  });

export interface UploadImageOptions {
  maxSizeMB?: number;
  maxWidth?: number;
  quality?: number;
}

export const imageFileToDataUrl = async (
  file: File,
  options: UploadImageOptions = {}
): Promise<string> => {
  const maxSizeBytes = (options.maxSizeMB ?? 5) * 1024 * 1024;
  const maxWidth = options.maxWidth ?? 1200;
  const quality = options.quality ?? 0.82;

  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload a valid image file.');
  }

  if (file.size > maxSizeBytes) {
    throw new Error(`Image must be ${options.maxSizeMB ?? 5}MB or smaller.`);
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);

  if (image.width <= maxWidth) {
    return originalDataUrl;
  }

  const ratio = maxWidth / image.width;
  const canvas = document.createElement('canvas');
  canvas.width = maxWidth;
  canvas.height = Math.round(image.height * ratio);

  const context = canvas.getContext('2d');
  if (!context) {
    return originalDataUrl;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
};


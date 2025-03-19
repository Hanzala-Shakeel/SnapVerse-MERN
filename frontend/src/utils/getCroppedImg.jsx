export const getCroppedImg = (imageSrc, crop) => {
  const image = new Image();
  image.src = imageSrc;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return reject("Canvas is empty");
        }
        const fileUrl = URL.createObjectURL(blob);
        resolve({ blob, fileUrl }); // Return both Blob and URL
      }, "image/jpeg");
    };

    image.onerror = (error) => reject(error); // Handle image load error
  });
};

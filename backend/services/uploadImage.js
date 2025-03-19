const cloudinary = require("../config/cloudinaryConfig");

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'instagram' },
            (error, result) => {
                if (error) {
                    console.log("Error uploading to Cloudinary.", error);
                    return reject(error);  // Reject the promise on error
                }
                // Resolve the promise with the Cloudinary URL
                resolve(result.secure_url);
            }
        ).end(file.buffer); // Pipe the buffer into Cloudinary uploader stream
    });
};

module.exports = uploadImage;

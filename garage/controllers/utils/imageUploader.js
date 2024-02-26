const firebase = require("../../../config/firebase");

//image upload to firebase => args: image and vehicle_reg as filename
async function imageUploader(image, barcode) {
  if (!image) {
    return "Error: No files found";
  } else {
    console.log("file is available");
    const promise = new Promise((resolve, reject) => {
      const image = firebase.bucket.file(`sparePartsImages/${barcode}`);

      const uploader = image.createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
          contentType: image.mimetype,
        },
      });
      uploader.on("error", (err) => {
        console.log("firebase upload error: ", err);
        resolve("UPLOAD_ERR");
      });
      uploader.on("finish", () => {
        // const url = image.publicUrl(); //get public url of uploaded image

        const url = `https://storage.googleapis.com/garage-lanka.appspot.com/sparePartsImages/${barcode}`;

        resolve(url);
      });
      uploader.end(image.buffer);
    });
    return promise;
  }
}

module.exports = {
  imageUploader,
};

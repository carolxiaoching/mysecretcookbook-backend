const firebaseAdmin = require("../connections/firebase");
const bucket = firebaseAdmin.storage().bucket();

const imagemin = require("imagemin");
// png 壓縮
const imageminPngquant = require("imagemin-pngquant");
// jpg/jpeg 壓縮
const imageminMozjpeg = require("imagemin-mozjpeg");
// svg 壓縮
const imageminSvgo = require("imagemin-svgo");

// 壓縮檔案
const compressImage = async (buffer, ext) => {
  if (ext === ".svg") {
    console.log("壓縮 SVG");

    const result = await imagemin.buffer(buffer, {
      plugins: [
        imageminSvgo({
          name: "preset-default",
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        }),
      ],
    });

    return result;
  } else if (ext === ".png") {
    console.log("壓縮 PNG");

    const result = await imagemin.buffer(buffer, {
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8], // 調整 PNG 品質
        }),
      ],
    });

    return result;
  } else if (ext === ".jpg" || ext === ".jpeg") {
    console.log("壓縮 JPG/JPEG");

    const result = await imagemin.buffer(buffer, {
      plugins: [
        imageminMozjpeg({
          quality: 75, // 調整 JPG 品質
        }),
      ],
    });

    return result;
  } else {
    console.log("不支援的圖片格式");
    return buffer; // 若格式不支援，直接回傳原始 buffer
  }
};

const uploadToStorage = (imagePath, fileBuffer) => {
  return new Promise((resolve, reject) => {
    // 基於檔案的原始名稱建立一個 blob 物件
    const blob = bucket.file(imagePath);
    // 建立一個可以寫入 blob 的物件
    const blobStream = blob.createWriteStream();

    // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
    blobStream.on("finish", () => {
      // 設定檔案的存取權限
      const config = {
        action: "read", // 權限
        expires: "12-31-2500", // 網址的有效期限
      };
      // 取得檔案的網址
      blob.getSignedUrl(config, async (err, imageUrl) => {
        if (err) {
          return reject(err);
        }
        resolve(imageUrl);
      });
    });

    // 如果上傳過程中發生錯誤，會觸發 error 事件
    blobStream.on("error", reject);
    // 將檔案的 buffer 寫入 Firebase Storage blobStream
    blobStream.end(fileBuffer);
  });
};

module.exports = {
  compressImage,
  uploadToStorage,
};

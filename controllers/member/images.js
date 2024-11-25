const tinify = require("tinify");
const { v4: uuidv4 } = require("uuid");
const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const firebaseAdmin = require("../../connections/firebase");
const validationUtils = require("../../utils/validationUtils");
const Image = require("../../models/image");

const bucket = firebaseAdmin.storage().bucket();
tinify.key = process.env.TINYPNG_API_KEY;

const ImageControllers = {
  // 上傳圖片
  async uploadImage(req, res, next) {
    const { auth } = req;
    const type = req.query?.type ? req.query.type : "photo";

    // 確認圖片類型
    if (type !== "photo" && type !== "avatar") {
      return appError(400, "圖片類型錯誤！", next);
    }

    // 確認是否有上傳圖片
    if (!req.files?.length) {
      return appError(400, "尚未上傳圖片！", next);
    }

    // 取得上傳檔案資訊列表的第一個檔案
    const file = req.files[0];

    // 上傳圖片到 TinyPNG 並壓縮
    tinify.fromBuffer(file.buffer).toBuffer((err, resultData) => {
      if (err) {
        throw err;
      }

      const imagePath = `images/${auth._id}/${uuidv4()}.${file.originalname
        .split(".")
        .pop()}`;

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
          // 將圖片資料加入到資料庫中
          const data = await Image.create({
            imageUrl,
            imagePath,
            type,
            user: auth._id,
          });

          const result = {
            _id: data._id,
            type: data.type,
            imageUrl: data.imageUrl,
          };

          return successHandler(res, 201, result);
        });
      });
      // 如果上傳過程中發生錯誤，會觸發 error 事件
      blobStream.on("error", (err) => {
        return appError(500, "上傳失敗", next);
      });
      // 將檔案的 buffer 寫入 blobStream
      blobStream.end(resultData);
    });
  },

  // 刪除指定圖片
  async delImage(req, res, next) {
    const { imageId } = req.params;

    if (!validationUtils.isValidObjectId(imageId)) {
      return appError(400, "圖片 ID 錯誤！", next);
    }

    if (!(await validationUtils.isIdExist(Image, imageId))) {
      return appError(400, "查無此圖片！", next);
    }

    const delImage = await Image.findByIdAndDelete(
      imageId,
      {
        new: true,
      },
      { imageUrl: 1, type: 1, _id: 1 }
    );

    // 若刪除失敗
    if (!delImage) {
      return appError(400, "刪除失敗，查無此圖片", next);
    }

    // 取得檔案路徑
    const { imagePath } = delImage;

    // 刪除 firebase storage 中圖片
    await bucket
      .file(imagePath)
      .delete()
      .then(() => {
        return successHandler(res, 200, delImage);
      })
      .catch(() => {
        return appError(500, "刪除失敗，查無此圖片", next);
      });
  },
};

module.exports = ImageControllers;

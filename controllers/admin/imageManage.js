const tinify = require("tinify");
const { v4: uuidv4 } = require("uuid");
const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const firebaseAdmin = require("../../connections/firebase");
const validationUtils = require("../../utils/validationUtils");
const paginationUtils = require("../../utils/paginationUtils");
const Image = require("../../models/image");
const User = require("../../models/user");

const bucket = firebaseAdmin.storage().bucket();

const ImageControllers = {
  // 取得所有圖片
  async getAllImages(req, res, next) {
    // 預設按更新日期從新到舊排序 (desc)，若為 asc 則從舊到新排序
    const sort = req.query.sort === "asc" ? "updatedAt" : "-updatedAt";

    // 第幾頁，預設為 1
    const page = req.query.page ? Number(req.query.page) : 1;

    // 每頁幾筆，預設為 10
    const perPage = req.query.perPage ? Number(req.query.perPage) : 10;

    // 判斷是否不分頁
    const noPagination = req.query.noPagination === "true" ? true : false;

    if (noPagination) {
      // 不分頁，返回所有資料
      const results = await Image.find({}).sort(sort);

      successHandler(res, 200, results);
    } else {
      const { results, pagination } = await paginationUtils({
        model: Image,
        sort,
        page,
        perPage,
      });

      successHandler(res, 200, { results, pagination });
    }
  },

  // 取得指定圖片
  async getImage(req, res, next) {
    const { imageId } = req.params;

    if (!validationUtils.isValidObjectId(imageId)) {
      return appError(400, "圖片 ID 錯誤！", next);
    }

    if (!(await validationUtils.isIdExist(Image, imageId))) {
      return appError(400, "查無此圖片！", next);
    }

    const image = await Image.findById(imageId);
    successHandler(res, 200, image);
  },

  // 刪除所有圖片
  async delAllImages(req, res, next) {
    // 刪除 firebase storage 中所有圖片
    await bucket
      .deleteFiles()
      .then(async () => {
        // 刪除資料庫中所有圖片
        await Image.deleteMany({});

        return successHandler(res, 200, []);
      })
      .catch(() => {
        return appError(500, "刪除失敗，查無此圖片", next);
      });
  },

  // 刪除指定會員所有圖片
  async delMemberAllImages(req, res, next) {
    const { memberId } = req.params;

    if (!validationUtils.isValidObjectId(memberId)) {
      return appError(400, "會員 ID 錯誤！", next);
    }

    if (!(await validationUtils.isIdExist(User, memberId))) {
      return appError(400, "查無此會員！", next);
    }

    // 刪除 firebase storage 中所有圖片
    await bucket
      .deleteFiles({ prefix: `images/${memberId}/` })
      .then(async () => {
        // 刪除資料庫中所有圖片
        await Image.deleteMany({ user: memberId });

        return successHandler(res, 200, []);
      })
      .catch(() => {
        return appError(500, "刪除失敗，查無此圖片", next);
      });
  },

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
          let data = await Image.create({
            imageUrl,
            imagePath,
            type,
            user: auth._id,
          });
          data = await data.populate({
            path: "user",
            select: "nickName avatarImgUrl",
          });

          return successHandler(res, 201, data);
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

    const delImage = await Image.findByIdAndDelete(imageId, {
      new: true,
    });

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

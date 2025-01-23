const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const validationUtils = require("../../utils/validationUtils");
const paginationUtils = require("../../utils/paginationUtils");
const Tag = require("../../models/tag");

const TagControllers = {
  // 取得全部標籤
  async getAllTags(req, res, next) {
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
      const results = await Tag.find({}).sort(sort);

      successHandler(res, 200, results);
    } else {
      const { results, pagination } = await paginationUtils({
        model: Tag,
        sort,
        page,
        perPage,
      });

      successHandler(res, 200, { results, pagination });
    }
  },

  // 取得指定標籤
  async getTag(req, res, next) {
    const { tagId } = req.params;

    if (!validationUtils.isValidObjectId(tagId)) {
      return appError(400, "標籤 ID 錯誤！", next);
    }

    if (!(await validationUtils.isIdExist(Tag, tagId))) {
      return appError(400, "查無此標籤！", next);
    }

    const tag = await Tag.findById(tagId);

    successHandler(res, 200, tag);
  },

  // 新增標籤
  async createTag(req, res, next) {
    const { title } = req.body;

    if (!validationUtils.isObjectEmpty(req.body)) {
      return appError(400, "欄位不得為空！", next);
    }

    if (!validationUtils.isValidString(title, 1, 10)) {
      return appError(400, "標籤標題需介於 1 到 10 個字元之間！", next);
    }

    // 新增資料
    const tag = await Tag.create({
      title,
    });

    successHandler(res, 201, tag);
  },

  // 更新標籤
  async updateTag(req, res, next) {
    const { tagId } = req.params;
    const { title } = req.body;

    const validations = [
      {
        condition: !validationUtils.isValidObjectId(tagId),
        message: "標籤 ID 錯誤！",
      },
      {
        condition: !(await validationUtils.isIdExist(Tag, tagId)),
        message: "查無此標籤！",
      },
      {
        condition: !validationUtils.isObjectEmpty(req.body),
        message: "欄位不得為空！",
      },
      {
        condition: !validationUtils.isValidString(title, 1, 10),
        message: "標籤標題需介於 1 到 10 個字元之間！",
      },
    ];

    validationUtils.checkValidation(validations, next);

    const newTag = await Tag.findByIdAndUpdate(
      tagId,
      {
        title,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    successHandler(res, 200, newTag);
  },

  // 刪除指定標籤
  async delTag(req, res, next) {
    const { tagId } = req.params;

    if (!validationUtils.isValidObjectId(tagId)) {
      return appError(400, "標籤 ID 錯誤！", next);
    }

    if (!(await validationUtils.isIdExist(Tag, tagId))) {
      return appError(400, "查無此標籤！", next);
    }

    const delTag = await Tag.findByIdAndDelete(tagId, {
      new: true,
    });

    // 若刪除失敗
    if (!delTag) {
      return appError(400, "刪除失敗，查無此標籤", next);
    }

    successHandler(res, 200, delTag);
  },

  // 刪除全部標籤
  async delAllTags(req, res, next) {
    await Tag.deleteMany({});

    successHandler(res, 200, []);
  },
};

module.exports = TagControllers;

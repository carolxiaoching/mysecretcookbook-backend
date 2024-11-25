const bcrypt = require("bcryptjs");
const appError = require("../../services/appError");
const successHandler = require("../../services/successHandler");
const validationUtils = require("../../utils/validationUtils");
const { generateAndSendJWT } = require("../../middleware/authMiddleware");
const User = require("../../models/user");
const Recipe = require("../../models/recipe");

const UserControllers = {
  // 註冊
  async signUp(req, res, next) {
    const { nickName, email, password, confirmPassword } = req.body;

    const validations = [
      {
        condition: !validationUtils.isObjectEmpty(req.body),
        message: "欄位不得為空！",
      },
      {
        condition: !validationUtils.isValidString(nickName, 2, 10),
        message: "暱稱需介於 2 到 10 個字元之間！",
      },
      {
        condition: !validationUtils.isValidPassword(password),
        message: "密碼需為英數混合，長度為 8 至 30 個字元！",
      },
      {
        condition: !validationUtils.isValidString(confirmPassword),
        message: "確認密碼不得為空！",
      },
      {
        condition: password !== confirmPassword,
        message: "密碼與確認密碼不一致！",
      },
      {
        condition: !validationUtils.isValidEmail(email),
        message: "電子信箱格式錯誤！",
      },
    ];

    validationUtils.checkValidation(validations, next);

    // 驗證電子信箱是否已被使用
    const checkEmailUnique = await User.findOne({ email });
    if (checkEmailUnique) {
      return appError(400, "此電子信箱已被使用！", next);
    }

    // 將密碼加密
    const newPassword = await bcrypt.hash(password, 12);

    // 新增資料
    const newUser = await User.create({
      nickName,
      email,
      password: newPassword,
      avatarImgUrl: "",
      gender: "secret",
      role: "member",
    });

    // 產生 JWT token 並回傳會員資料
    generateAndSendJWT(res, 201, newUser);
  },

  // 登入
  async signIn(req, res, next) {
    const { email, password } = req.body;

    const validations = [
      {
        condition: !validationUtils.isObjectEmpty(req.body),
        message: "欄位不得為空！",
      },
      {
        condition: !validationUtils.isValidString(password),
        message: "密碼欄位錯誤！",
      },
      {
        condition: !validationUtils.isValidEmail(email),
        message: "電子信箱格式錯誤！",
      },
    ];

    validationUtils.checkValidation(validations, next);

    // 取出 user 資料
    const user = await User.findOne({ email }).select("+password");

    // 驗證電子郵件是否已註冊
    if (!user) {
      return appError(400, "此帳號尚未被註冊過！", next);
    }

    // 比對密碼是否與資料庫的相符
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return appError(400, "密碼錯誤！", next);
    }

    // 產生 JWT token 並回傳會員資料
    generateAndSendJWT(res, 200, user);
  },

  // 取得指定會員公開資料
  async getUserPublicProfile(req, res, next) {
    const { userId } = req.params;

    if (!validationUtils.isValidObjectId(userId)) {
      return appError(400, "會員 ID 錯誤！", next);
    }

    if (!(await validationUtils.isIdExist(User, userId))) {
      return appError(400, "查無此會員！", next);
    }

    const user = await User.findById(userId);
    successHandler(res, 200, user);
  },

  // 取得我的資料
  async getMyProfile(req, res, next) {
    const { auth } = req;
    const user = await User.findById(auth._id).select("+email");

    successHandler(res, 200, user);
  },

  // 更新我的資料
  async updateMyProfile(req, res, next) {
    const { auth } = req;
    const { nickName, gender, avatarImgUrl } = req.body;

    const validations = [
      {
        condition: !validationUtils.isObjectEmpty(req.body),
        message: "欄位不得為空！",
      },
      {
        condition:
          nickName !== undefined &&
          !validationUtils.isValidString(nickName, 2, 10),
        message: "暱稱需介於 2 到 10 個字元之間！",
      },
      {
        condition:
          gender !== undefined &&
          !["secret", "male", "female"].includes(gender),
        message: "性別欄位錯誤！",
      },
      {
        condition:
          avatarImgUrl !== undefined &&
          !validationUtils.isValidUrl(avatarImgUrl),
        message: "頭像格式錯誤！",
      },
    ];

    validationUtils.checkValidation(validations, next);

    const newUser = await User.findByIdAndUpdate(
      auth._id,
      {
        nickName,
        gender,
        avatarImgUrl,
      },
      {
        new: true,
        runValidators: true,
        fields: "+email", // 顯示隱藏的 email 字段
      }
    );

    successHandler(res, 200, newUser);
  },

  // 重設密碼
  async updatePassword(req, res, next) {
    const { auth } = req;
    const { password, confirmPassword } = req.body;

    const validations = [
      {
        condition: !validationUtils.isObjectEmpty(req.body),
        message: "欄位不得為空！",
      },
      {
        condition: !validationUtils.isValidPassword(password),
        message: "密碼需為英數混合，長度為 8 至 30 個字元！",
      },
      {
        condition: !validationUtils.isValidString(confirmPassword),
        message: "確認密碼不得為空！",
      },
      {
        condition: password !== confirmPassword,
        message: "密碼與確認密碼不一致！",
      },
    ];

    validationUtils.checkValidation(validations, next);

    // 將密碼加密
    const newPassword = await bcrypt.hash(password, 12);

    // 更新資料庫中密碼
    const newUser = await User.findByIdAndUpdate(
      auth._id,
      {
        password: newPassword,
      },
      {
        new: true,
        runValidators: true,
        fields: "+email", // 顯示隱藏的 email 字段
      }
    );

    generateAndSendJWT(res, 200, newUser);
  },

  // 取得我的收藏列表
  async getCollectList(req, res, next) {
    const { auth } = req;

    // 預設按更新日期從新到舊排序 (desc)，若為 asc 則從舊到新排序
    const sort = req.query.sort == "asc" ? "updatedAt" : "-updatedAt";

    const collectList = await Recipe.find(
      {
        collects: { $in: [auth._id] },
        isPublic: true,
      },
      {
        _id: 1,
        title: 1,
        coverImgUrl: 1,
        category: 1,
        user: 1,
        cookingTime: 1,
        servings: 1,
        collects: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    ).sort(sort);

    successHandler(res, 200, collectList);
  },
};

module.exports = UserControllers;

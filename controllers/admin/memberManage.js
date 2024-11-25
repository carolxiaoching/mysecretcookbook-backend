const bcrypt = require("bcryptjs");
const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const validationUtils = require("../../utils/validationUtils");
const { generateAndSendJWT } = require("../../middleware/authMiddleware");
const User = require("../../models/user");

const MemberControllers = {
  // 管理員登入
  async signIn(req, res, next) {
    const { email, password } = req.body;

    const validations = [
      {
        condition: !validationUtils.isObjectEmpty(req.body),
        message: "欄位不得為空！",
      },
      {
        condition: !validationUtils.isValidString(password, 1, 30),
        message: "密碼欄位錯誤！",
      },
      {
        condition: !validationUtils.isValidEmail(email),
        message: "電子信箱格式錯誤！",
      },
    ];

    validationUtils.checkValidation(validations, next);

    // 取出 member 資料
    const member = await User.findOne({ email, role: "admin" }).select(
      "+password"
    );

    // 驗證電子郵件是否已註冊
    if (!member) {
      return appError(400, "此帳號尚未被註冊過或權限不足！", next);
    }

    // 比對密碼是否與資料庫的相符
    const auth = await bcrypt.compare(password, member.password);
    if (!auth) {
      return appError(400, "密碼錯誤！", next);
    }

    // 產生 JWT token 並回傳會員資料
    generateAndSendJWT(res, 200, member);
  },

  // 確認管理員登入狀態
  async checkLoginStatus(req, res, next) {
    const { auth } = req;

    // 取出 admin 資料
    const admin = await User.findById(auth._id).select("+email");

    // 產生 JWT token 並回傳會員資料
    generateAndSendJWT(res, 200, admin);
  },

  // 取得所有會員資料
  async getAllMembers(req, res, next) {
    // 預設按更新日期從新到舊排序 (desc)，若為 asc 則從舊到新排序
    const sort = req.query.sort == "asc" ? "updatedAt" : "-updatedAt";

    const members = await User.find({}).select("+email +role").sort(sort);

    successHandler(res, 200, members);
  },

  // 取得指定會員資料
  async getMember(req, res, next) {
    const { memberId } = req.params;

    if (!validationUtils.isValidObjectId(memberId)) {
      return appError(400, "會員 ID 錯誤！", next);
    }

    if (!(await validationUtils.isIdExist(User, memberId))) {
      return appError(400, "查無此會員！", next);
    }

    const member = await User.findById(memberId).select("+email +role");
    successHandler(res, 200, member);
  },

  // 更新指定會員資料
  async updateMember(req, res, next) {
    const { memberId } = req.params;
    const { nickName, gender, avatarImgUrl, role } = req.body;

    const validations = [
      {
        condition: !validationUtils.isValidObjectId(memberId),
        message: "會員 ID 錯誤！",
      },
      {
        condition: !(await validationUtils.isIdExist(User, memberId)),
        message: "查無此會員！",
      },
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

    const newMember = await User.findByIdAndUpdate(
      memberId,
      {
        nickName,
        gender,
        avatarImgUrl,
        role,
      },
      {
        new: true,
        runValidators: true,
        fields: "+email +role", // 顯示預設隱藏的 email、role
      }
    );

    successHandler(res, 200, newMember);
  },

  // 刪除指定會員
  async delMember(req, res, next) {
    const { memberId } = req.params;

    if (!validationUtils.isValidObjectId(memberId)) {
      return appError(400, "會員 ID 錯誤！", next);
    }

    if (!(await validationUtils.isIdExist(User, memberId))) {
      return appError(400, "查無此會員！", next);
    }

    const delMember = await User.findByIdAndDelete(memberId, {
      new: true,
    });

    // 若刪除失敗
    if (!delMember) {
      return appError(400, "刪除失敗，查無此會員", next);
    }

    successHandler(res, 200, delMember);
  },

  // 刪除全部會員
  async delAllMembers(req, res, next) {
    // 刪除所有會員
    await User.deleteMany({});

    successHandler(res, 200, []);
  },
};

module.exports = MemberControllers;

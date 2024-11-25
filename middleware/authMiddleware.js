const jwt = require("jsonwebtoken");
const successHandler = require("../services/successHandler");
const appError = require("../services/appError");
const errorAsyncHandler = require("../services/errorAsyncHandler");
const User = require("../models/user");

// 從 Headers 取得 token
const getTokenFromHeaders = (headers) => {
  if (headers.authorization && headers.authorization.startsWith("Bearer")) {
    return headers.authorization.split(" ")[1];
  }
  return "";
};

// 驗證 token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

// 產生 JWT token 並回傳會員資料
const generateAndSendJWT = (res, statusCode, user) => {
  // 產生 token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  // 將傳入的密碼清空，避免不小心外洩
  user.password = undefined;
  const data = {
    token,
    user: {
      _id: user._id,
      nickName: user.nickName,
      email: user.email,
      avatarImgUrl: user.avatarImgUrl,
      gender: user.gender,
    },
  };

  successHandler(res, statusCode, data);
};

// 檢查 token 並設定 authId
const checkTokenAndSetAuth = errorAsyncHandler(async (req, res, next) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return appError(401, "尚未登入！", next);
  }

  const decoded = await verifyToken(token);
  req.authId = decoded.id;

  next();
});

// 根據 authId 來設定會員資料
const getUserFromAuthId = errorAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.authId).select("+role");
  if (!user) {
    return appError(401, "查無此會員 ID", next);
  }

  req.auth = user;

  next();
});

// 檢查會員是否為管理員
const isAdmin = errorAsyncHandler(async (req, res, next) => {
  const { role } = req.auth;
  if (role !== "admin") {
    return appError(403, "無管理員權限", next);
  }
  next();
});

// 確認登入狀態，若已登入則取得會員資料，未登入或登入失敗則跳過
// const optionalAuth = errorAsyncHandler(async (req, res, next) => {
//   const token = getTokenFromHeaders(req.headers);

//   if (token) {
//     const decoded = await verifyToken(token);
//     req.authId = decoded.id;

//     const user = await User.findById(req.authId);

//     if (user) {
//       req.auth = user;
//     }
//   }

//   next();
// });

module.exports = {
  generateAndSendJWT,
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  // optionalAuth,
};

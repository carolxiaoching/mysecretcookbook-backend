const express = require("express");
const router = express.Router();
const forgetControllers = require("../../controllers/member/forget");
const errorAsyncHandler = require("../../services/errorAsyncHandler");

// 取得全部分類
router.post(
  "/forget-password",
  errorAsyncHandler(forgetControllers.forgetPassword)
);
router.post(
  "/reset-password",
  errorAsyncHandler(forgetControllers.resetPassword)
);

module.exports = router;

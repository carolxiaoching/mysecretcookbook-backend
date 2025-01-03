const express = require("express");
const router = express.Router();
const UserControllers = require("../../controllers/member/users");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// 註冊
router.post(
  "/user/signUp",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "註冊"
   * #swagger.description = "註冊"
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$nickName": "Carol",
        "$email": "carol@gmail.com",
        "$password": "carol123",
        "$confirmPassword": "carol123"
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTVhYTI0YWYxOGIyNzI5NmQ0MmE4MiIsImlhdCI6MTY1NTAyNDE2NCwiZXhwIjoxNjU1NjI4OTY0fQ.ylNUe_TfC7rqykZuJZdhOrp_oa4fKXwxniSrNk-SbhI",
          "user": {
            "_id": "62a5aa24af18b27296d42a82",
            "nickName": "Carol",
            "email": "carol@gmail.com",
            "avatarImgUrl": "",
            "discription": "",
            "gender": "secret"
          }
        }
      }
    }
  */
  errorAsyncHandler(UserControllers.signUp)
);

// 登入
router.post(
  "/user/signIn",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "登入"
   * #swagger.description = "登入"
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$email": "carol@gmail.com",
        "$password": "carol123",
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTVhYTI0YWYxOGIyNzI5NmQ0MmE4MiIsImlhdCI6MTY1NTAyNDE2NCwiZXhwIjoxNjU1NjI4OTY0fQ.ylNUe_TfC7rqykZuJZdhOrp_oa4fKXwxniSrNk-SbhI",
          "user": {
            "_id": "62a5aa24af18b27296d42a82",
            "nickName": "Carol",
            "email": "carol@gmail.com",
            "avatarImgUrl": "",
            "discription": "",
            "gender": "secret"
          }
        }
      }
    }
  */
  errorAsyncHandler(UserControllers.signIn)
);

// 取得指定會員公開資料
router.get(
  "/user/:userId/profile",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "取得指定會員公開資料"
   * #swagger.description = "取得指定會員公開資料"
   * #swagger.parameters["userId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "會員 ID",
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "62a5aa24af18b27296d42a82",
          "nickName": "Carol",
          "avatarImgUrl": "",
          "gender": "secret",
          "discription": "",
          "createdAt": "2024-08-02T17:08:01.747Z",
          "updatedAt": "2024-08-02T17:08:01.747Z"
        }
      }
    }
  */
  errorAsyncHandler(UserControllers.getUserPublicProfile)
);

// 取得我的資料
router.get(
  "/user/profile",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "取得我的資料"
   * #swagger.description = "取得我的資料"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "66ad12532a4c0826b5b65f3b",
          "nickName": "Carol",
          "gender": "secret",
          "avatarImgUrl": "https://123.png",
          "discription": "",
          "email": "carol@mail.com",
          "createdAt": "2024-08-02T17:07:31.743Z",
          "updatedAt": "2024-08-07T17:02:49.701Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(UserControllers.getMyProfile)
);

// 更新我的資料
router.patch(
  "/user/profile",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "更新我的資料"
   * #swagger.description = "更新我的資料"
   * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "nickName": "Carol",
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "66ad12532a4c0826b5b65f3b",
          "nickName": "Carol",
          "gender": "secret",
          "avatarImgUrl": "https://123.png",
          "discription": "",
          "email": "carol@mail.com",
          "createdAt": "2024-08-02T17:07:31.743Z",
          "updatedAt": "2024-08-07T17:02:49.701Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(UserControllers.updateMyProfile)
);

// 重設密碼
router.post(
  "/user/updatePassword",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "重設密碼"
   * #swagger.description = "重設密碼"
   * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$password": "carol123",
        "$confirmPassword": "carol123"
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "66ad12532a4c0826b5b65f3b",
          "nickName": "Carol",
          "gender": "secret",
          "avatarImgUrl": "https://123.png",
          "discription": "",
          "email": "carol@mail.com",
          "createdAt": "2024-08-02T17:07:31.743Z",
          "updatedAt": "2024-08-07T17:02:49.701Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(UserControllers.updatePassword)
);

// 取得我的收藏列表
router.get(
  "/user/getCollectList",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "取得我的收藏列表"
   * #swagger.description = "取得我的收藏列表"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": [
          {
            "nutritionFacts": {
              "calories": 0,
              "protein": 0,
              "totalFat": 0,
              "totalCarb": 0,
              "sodium": 0,
              "sugar": 0
            },
            "_id": "66b50fa7e845914dc7268af3",
            "title": "午後紅茶",
            "coverImgUrl": "https://123.png",
            "isPublic": true,
            "category": {
              "_id": "66ad17220c1f2d5e934ba5d5",
              "title": "飲品"
            },
            "user": {
              "_id": "66ad12712a4c0826b5b65f3e",
              "nickName": "carol",
              "avatarImgUrl": ""
              "discription": "",
            },
            "cookingTime": "0-15 分鐘",
            "description": "描述2",
            "servings": 1,
            "ingredients": [
              {
                "ingredientName": "紅茶包",
                "ingredientQty": "2包",
                "_id": "66b50fa7e845914dc7268af4"
              }
            ],
            "steps": [
              {
                "stepOrder": 1,
                "stepContent": "準備 200 cc 沸水，將茶包放入",
                "_id": "66b50fa7e845914dc7268af5"
              }
            ],
            "note": "",
            "collects": [
              "66ad12712a4c0826b5b65f3e"
            ],
            "createdAt": "2024-08-08T18:34:15.748Z",
            "updatedAt": "2024-08-08T19:03:11.666Z"
          }
        ]
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(UserControllers.getCollectList)
);

module.exports = router;

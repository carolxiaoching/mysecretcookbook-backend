const express = require("express");
const router = express.Router();
const ImageControllers = require("../../controllers/admin/imageManage");
const imageMiddleware = require("../../middleware/imageMiddleware");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
} = require("../../middleware/authMiddleware");

// 取得所有圖片
router.get(
  "/images",
  /**
    * #swagger.tags = ["管理員 - Image 圖片"]
    * #swagger.summary = "取得所有圖片"
    * #swagger.description = "取得所有圖片"
    * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["query"] = [
      {
        in: "query",
        name: "sort",
        type: "string",
        description: "依更新日期排序 asc 舊到新，desc 新到舊，預設為 desc"
      }
    ]
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": [
          {
            "_id": "66b42c391905521b87d5c432",
            "imageUrl": "https://storage.googleapis.com/123",
            "imagePath": "images/66ad12712a4c0826b5b65f3e/2c531f86-bd6d-4c9c-a7fa-be00b929c137.png",
            "type": "photo",
            "user": {
              "_id": "66ad12712a4c0826b5b65f3e",
              "nickName": "carol",
              "avatarImgUrl": ""
            },
            "createdAt": "2024-08-08T02:23:53.507Z",
            "updatedAt": "2024-08-08T02:23:53.507Z"
          }
        ]
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(ImageControllers.getAllImages)
);

// 取得指定圖片
router.get(
  "/image/:imageId",
  /**
    * #swagger.tags = ["管理員 - Image 圖片"]
    * #swagger.summary = "取得指定圖片"
    * #swagger.description = "取得指定圖片"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["imageId"] = {
      in: "path",
      name: "type",
      type: "string",
      description: "圖片 ID"
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "66b42c391905521b87d5c432",
          "imageUrl": "https://storage.googleapis.com/123",
          "imagePath": "images/66ad12712a4c0826b5b65f3e/2c531f86-bd6d-4c9c-a7fa-be00b929c137.png",
          "type": "photo",
          "user": {
            "_id": "66ad12712a4c0826b5b65f3e",
            "nickName": "carol",
            "avatarImgUrl": ""
          },
          "createdAt": "2024-08-08T02:23:53.507Z",
          "updatedAt": "2024-08-08T02:23:53.507Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(ImageControllers.getImage)
);

// 刪除指定會員所有圖片
router.delete(
  "/images/member/:memberId",
  /**
    * #swagger.tags = ["管理員 - Image 圖片"]
    * #swagger.summary = "刪除指定會員所有圖片"
    * #swagger.description = "刪除指定會員所有圖片"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["memberId"] = {
      in: "path",
      name: "type",
      type: "string",
      description: "會員 ID"
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": []
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(ImageControllers.delMemberAllImages)
);

// 刪除所有圖片
router.delete(
  "/images",
  /**
    * #swagger.tags = ["管理員 - Image 圖片"]
    * #swagger.summary = "刪除所有圖片"
    * #swagger.description = "刪除所有圖片"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": []
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(ImageControllers.delAllImages)
);

// 上傳圖片
router.post(
  "/image",
  /**
    * #swagger.tags = ["管理員 - Image 圖片"]
    * #swagger.summary = "上傳圖片"
    * #swagger.description = "上傳圖片"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.consumes = ['multipart/form-data']
    * #swagger.parameters["query"] = {
      in: "query",
      name: "type",
      type: "string",
      required: false,
      description: "avatar 大頭照、photo 一般照片，預設為 photo"
    }
    * #swagger.parameters["singleFile"] = {
      in: "formData",
      name:'img',
      type: "file",
      required: true,
      description: "圖片",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "imageUrl": "https://storage.googleapis.com/my-secret-cookbook-5ecf1.appspot.com/images/66ad12712a4c0826b5b65f3e/465efc60-ca9e-41d0-838a-66d0188a3a78.jpg?GoogleAccessId=firebase-adminsdk-mu8pu%40my-secret-cookbook-5ecf1.iam.gserviceaccount.com&Expires=16756646400&Signature=KqyNd8KhhpD4gbjeDGNGueCkpnRo4irn7Ph7tbv5L59DzYHJqiZU7bw03ILzHokT1%2F4uou%2BP%2FZm0dPysRQS1ABxEQXaOk3ZHEGb7QiejYszAqODe9wSZzzYkIwVVix0jpGpnIZFe4jGJFaILNnTu%2F8TREF1JJI8hns80ccrfRNyBJTVba9ZtScqTCHuG3rLyGv52KZBh6VgqEVZnN7VqOW94RgSMTGbU2GxzYiVATDMwE3ED%2B7prKylfP0mDEmd1uqzL5RllJAZonS3A2Nmb%2BGERjg0suYTyG5Ff7Wkz9JsHWaEW2EXslvK31vn0z2dvF%2BrVc%2BqoP9GGgpQpFOocbA%3D%3D",
          "imagePath": "images/66ad12712a4c0826b5b65f3e/465efc60-ca9e-41d0-838a-66d0188a3a78.jpg",
          "type": "photo",
          "user": {
            "_id": "66ad12712a4c0826b5b65f3e",
            "nickName": "carol",
            "avatarImgUrl": ""
          },
          "_id": "66b7a268fc467a804ba21c31",
          "createdAt": "2024-08-10T17:24:56.684Z",
          "updatedAt": "2024-08-10T17:24:56.684Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  imageMiddleware,
  errorAsyncHandler(ImageControllers.uploadImage)
);

// 刪除指定圖片
router.delete(
  "/image/:imageId",
  /**
    * #swagger.tags = ["管理員 - Image 圖片"]
    * #swagger.summary = "刪除指定圖片"
    * #swagger.description = "刪除指定圖片"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["imageId"] = {
      in: "path",
      name: "type",
      type: "string",
      description: "圖片 ID"
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "66b7a268fc467a804ba21c31",
          "imageUrl": "https://storage.googleapis.com/my-secret-cookbook-5ecf1.appspot.com/images/66ad12712a4c0826b5b65f3e/465efc60-ca9e-41d0-838a-66d0188a3a78.jpg?GoogleAccessId=firebase-adminsdk-mu8pu%40my-secret-cookbook-5ecf1.iam.gserviceaccount.com&Expires=16756646400&Signature=KqyNd8KhhpD4gbjeDGNGueCkpnRo4irn7Ph7tbv5L59DzYHJqiZU7bw03ILzHokT1%2F4uou%2BP%2FZm0dPysRQS1ABxEQXaOk3ZHEGb7QiejYszAqODe9wSZzzYkIwVVix0jpGpnIZFe4jGJFaILNnTu%2F8TREF1JJI8hns80ccrfRNyBJTVba9ZtScqTCHuG3rLyGv52KZBh6VgqEVZnN7VqOW94RgSMTGbU2GxzYiVATDMwE3ED%2B7prKylfP0mDEmd1uqzL5RllJAZonS3A2Nmb%2BGERjg0suYTyG5Ff7Wkz9JsHWaEW2EXslvK31vn0z2dvF%2BrVc%2BqoP9GGgpQpFOocbA%3D%3D",
          "imagePath": "images/66ad12712a4c0826b5b65f3e/465efc60-ca9e-41d0-838a-66d0188a3a78.jpg",
          "type": "photo",
          "user": {
            "_id": "66ad12712a4c0826b5b65f3e",
            "nickName": "carol",
            "avatarImgUrl": ""
          },
          "createdAt": "2024-08-10T17:24:56.684Z",
          "updatedAt": "2024-08-10T17:24:56.684Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  errorAsyncHandler(ImageControllers.delImage)
);

module.exports = router;

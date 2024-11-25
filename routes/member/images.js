const express = require("express");
const router = express.Router();
const ImageControllers = require("../../controllers/member/images");
const imageMiddleware = require("../../middleware/imageMiddleware");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// 上傳圖片
router.post(
  "/image",
  /**
    * #swagger.tags = ["Image 圖片"]
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
          "type": "photo",
          "_id": "66b7a268fc467a804ba21c31",
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
    * #swagger.tags = ["Image 圖片"]
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
            "type": "photo",
          }
        }
    }
  */
  checkTokenAndSetAuth,
  errorAsyncHandler(ImageControllers.delImage)
);

module.exports = router;

const express = require("express");
const router = express.Router();
const TagControllers = require("../../controllers/admin/tagManage");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
} = require("../../middleware/authMiddleware");

// 取得全部標籤
router.get(
  "/tags",
  /**
    * #swagger.tags = ["管理員 - Tag 標籤"]
    * #swagger.summary = "取得全部標籤"
    * #swagger.description = "取得全部標籤"
    * #swagger.parameters["tagId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "標籤 ID",
    }
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
            "title": "素食",
            "_id": "66b62acd7d1468039fc925e8",
            "createdAt": "2024-08-09T14:42:21.111Z",
            "updatedAt": "2024-08-09T14:42:21.111Z"
          },
          {
            "title": "懶人料理",
            "_id": "66b55acd7d1468039fc92566",
            "createdAt": "2024-08-09T14:42:21.111Z",
            "updatedAt": "2024-08-09T14:42:21.111Z"
          }
        ]
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(TagControllers.getAllTags)
);

// 取得指定標籤
router.get(
  "/tag/:tagId",
  /**
    * #swagger.tags = ["管理員 - Tag 標籤"]
    * #swagger.summary = "取得指定標籤"
    * #swagger.description = "取得指定標籤"
    * #swagger.parameters["tagId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "標籤 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "title": "素食",
          "_id": "66b62acd7d1468039fc925e8",
          "createdAt": "2024-08-09T14:42:21.111Z",
          "updatedAt": "2024-08-09T14:42:21.111Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(TagControllers.getTag)
);

// 新增標籤
router.post(
  "/tag",
  /**
    * #swagger.tags = ["管理員 - Tag 標籤"]
    * #swagger.summary = "新增標籤"
    * #swagger.description = "新增標籤"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$title": "素食",
      }
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "title": "素食",
          "_id": "66b62acd7d1468039fc925e8",
          "createdAt": "2024-08-09T14:42:21.111Z",
          "updatedAt": "2024-08-09T14:42:21.111Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(TagControllers.createTag)
);

// 更新標籤
router.patch(
  "/tag/:tagId",
  /**
    * #swagger.tags = ["管理員 - Tag 標籤"]
    * #swagger.summary = "更新標籤"
    * #swagger.description = "更新標籤"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["tagId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "標籤 ID",
    }
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$title": "素食",
      }
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "title": "素食",
          "_id": "66b62acd7d1468039fc925e8",
          "createdAt": "2024-08-09T14:42:21.111Z",
          "updatedAt": "2024-08-09T14:42:21.111Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(TagControllers.updateTag)
);

// 刪除指定標籤
router.delete(
  "/tag/:tagId",
  /**
    * #swagger.tags = ["管理員 - Tag 標籤"]
    * #swagger.summary = "刪除指定標籤"
    * #swagger.description = "刪除指定標籤"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["tagId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "標籤 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "title": "素食",
          "_id": "66b62acd7d1468039fc925e8",
          "createdAt": "2024-08-09T14:42:21.111Z",
          "updatedAt": "2024-08-09T14:42:21.111Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(TagControllers.delTag)
);

// 刪除全部標籤
router.delete(
  "/tags",
  /**
    * #swagger.tags = ["管理員 - Tag 標籤"]
    * #swagger.summary = "刪除全部標籤"
    * #swagger.description = "刪除全部標籤"
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
  errorAsyncHandler(TagControllers.delAllTags)
);

module.exports = router;

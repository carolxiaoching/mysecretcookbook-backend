const express = require("express");
const router = express.Router();
const CategoryControllers = require("../../controllers/admin/categoryManage");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
} = require("../../middleware/authMiddleware");

// 取得全部分類
router.get(
  "/categories",
  /**
    * #swagger.tags = ["管理員 - Category 分類"]
    * #swagger.summary = "取得全部分類"
    * #swagger.description = "取得全部分類"
    * #swagger.parameters["categoryId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "分類 ID",
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
            "title": "日韓料理",
            "_id": "66b62acd7d1468039fc925e8",
            "createdAt": "2024-08-09T14:42:21.111Z",
            "updatedAt": "2024-08-09T14:42:21.111Z"
          },
          {
            "title": "飲品",
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
  errorAsyncHandler(CategoryControllers.getAllCategories)
);

// 取得指定分類
router.get(
  "/category/:categoryId",
  /**
    * #swagger.tags = ["管理員 - Category 分類"]
    * #swagger.summary = "取得指定分類"
    * #swagger.description = "取得指定分類"
    * #swagger.parameters["categoryId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "分類 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "title": "日韓料理",
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
  errorAsyncHandler(CategoryControllers.getCategory)
);

// 新增分類
router.post(
  "/category",
  /**
    * #swagger.tags = ["管理員 - Category 分類"]
    * #swagger.summary = "新增分類"
    * #swagger.description = "新增分類"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$title": "日韓料理",
      }
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "title": "日韓料理",
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
  errorAsyncHandler(CategoryControllers.createCategory)
);

// 更新分類
router.patch(
  "/category/:categoryId",
  /**
    * #swagger.tags = ["管理員 - Category 分類"]
    * #swagger.summary = "更新分類"
    * #swagger.description = "更新分類"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["categoryId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "分類 ID",
    }
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$title": "日韓料理",
      }
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "title": "日韓料理",
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
  errorAsyncHandler(CategoryControllers.updateCategory)
);

// 刪除指定分類
router.delete(
  "/category/:categoryId",
  /**
    * #swagger.tags = ["管理員 - Category 分類"]
    * #swagger.summary = "刪除指定分類"
    * #swagger.description = "刪除指定分類"
    * #swagger.security = [{
      "Bearer": []
    }]
    * #swagger.parameters["categoryId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "分類 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "title": "日韓料理",
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
  errorAsyncHandler(CategoryControllers.delCategory)
);

// 刪除全部分類
router.delete(
  "/categories",
  /**
    * #swagger.tags = ["管理員 - Category 分類"]
    * #swagger.summary = "刪除全部分類"
    * #swagger.description = "刪除全部分類"
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
  errorAsyncHandler(CategoryControllers.delAllCategories)
);

module.exports = router;

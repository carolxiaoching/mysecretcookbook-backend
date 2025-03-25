const express = require("express");
const router = express.Router();
const RecipeControllers = require("../../controllers/admin/recipeManage");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
} = require("../../middleware/authMiddleware");

// 建立食譜
router.post(
  "/recipe",
  /**
   * #swagger.tags = ["管理員 - Recipe 食譜"]
   * #swagger.summary = "建立食譜"
   * #swagger.description = "建立食譜"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$nutritionFacts": {
          "calories": 0,
          "protein": 0,
          "totalFat": 0,
          "totalCarb": 0,
          "sodium": 0,
          "sugar": 0
        },
        "$title": "紅茶",
        "$coverImgUrl": "https://123.png",
        "$isPublic": true,
        "$category": "66ad17220c1f2d5e934ba5d5",
        "$cookingTime": "0-15 分鐘",
        "$description": "描述2",
        "$servings": 1,
        "$ingredients": [
          {
            "ingredientName": "紅茶包",
            "ingredientQty": "2包",
          }
        ],
        "$steps": [
          {
            "stepOrder": 1,
            "stepContent": "準備 200 cc 沸水，將茶包放入",
          }
        ],
        "note": "",
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "nutritionFacts": {
            "calories": 0,
            "protein": 0,
            "totalFat": 0,
            "totalCarb": 0,
            "sodium": 0,
            "sugar": 0
          },
          "_id": "66b50fa7e845914dc7268af3",
          "title": "紅茶",
          "coverImgUrl": "https://123.png",
          "isPublic": true,
          "category": "66ad17220c1f2d5e934ba5d5",
          "user": {
            "_id": "66ad12712a4c0826b5b65f3e",
            "nickName": "carol",
            "avatarImgUrl": ""
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
          "collects": [],
          "createdAt": "2025-01-08T18:34:15.748Z",
          "updatedAt": "2025-01-08T19:03:11.666Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(RecipeControllers.createRecipe)
);

// 取得所有食譜
router.get(
  "/recipes",
  /**
    * #swagger.tags = ["管理員 - Recipe 食譜"]
    * #swagger.summary = "取得所有食譜"
    * #swagger.description = "取得所有食譜"
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
"data": {
          "results": [
            {
              "_id": "6789f201862fb3b01124e466",
              "title": "雞肉丼飯",
              "coverImgUrl": "https://123.jpg",
              "isPublic": true,
              "category": "6747ffe7bbe060fd3f49a366",
              "user": {
                  "_id": "66ad12532a4c0826b5b65f66",
                  "nickName": "admin",
                  "avatarImgUrl": "https://123.jpg"
              },
              "cookingTime": "15-30 分鐘",
              "description": "日式風味的雞肉丼飯，簡單又快速，適合忙碌的工作日。",
              "servings": 2,
              "createdAt": "2025-01-17T11:05:00.000Z",
              "updatedAt": "2025-03-15T05:37:01.984Z",
              "tags": [
                  "67458c7b58e288bc86d66a88",
              ],
              "collectsCount": 2,
              "isRecommended": true
            }
          ],
          "pagination": {
            "totalPage": 1,
            "currentPage": 1,
            "hasPrev": false,
            "hasNext": false
          }
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(RecipeControllers.getAllRecipes)
);

// 取得指定食譜
router.get(
  "/recipe/:recipeId",
  /**
    * #swagger.tags = ["管理員 - Recipe 食譜"]
    * #swagger.summary = "取得指定食譜"
    * #swagger.description = "取得指定食譜"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["recipeId"] = {
        in: "path",
        type: "string",
        required: true,
        description: "食譜 ID",
      }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "nutritionFacts": {
            "calories": 0,
            "protein": 0,
            "totalFat": 0,
            "totalCarb": 0,
            "sodium": 0,
            "sugar": 0
          },
          "_id": "66b50fa7e845914dc7268af3",
          "title": "CAROL 紅茶",
          "coverImgUrl": "https://123.png",
          "isPublic": true,
          "category": "66ad17220c1f2d5e934ba5d5",
          "user": {
            "_id": "66ad12712a4c0826b5b65f3e",
            "nickName": "carol",
            "avatarImgUrl": ""
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
          "createdAt": "2025-01-08T18:34:15.748Z",
          "updatedAt": "2025-01-08T19:03:11.666Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(RecipeControllers.getRecipe)
);

// 更新指定食譜
router.patch(
  "/recipe/:recipeId",
  /**
    * #swagger.tags = ["管理員 - Recipe 食譜"]
    * #swagger.summary = "更新指定食譜"
    * #swagger.description = "更新指定食譜"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["recipeId"] = {
        in: "path",
        type: "string",
        required: true,
        description: "食譜 ID",
      }
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "title": "午後紅茶",
      }
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "nutritionFacts": {
            "calories": 0,
            "protein": 0,
            "totalFat": 0,
            "totalCarb": 0,
            "sodium": 0,
            "sugar": 0
          },
          "_id": "66b50fa7e845914dc7268af3",
          "title": "CAROL 紅茶",
          "coverImgUrl": "https://123.png",
          "isPublic": true,
          "category": "66ad17220c1f2d5e934ba5d5",
          "user": {
            "_id": "66ad12712a4c0826b5b65f3e",
            "nickName": "carol",
            "avatarImgUrl": ""
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
          "createdAt": "2025-01-08T18:34:15.748Z",
          "updatedAt": "2025-01-08T19:03:11.666Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(RecipeControllers.updateRecipe)
);

// 取得指定會員所有食譜
router.get(
  "/recipes/member/:memberId",
  /**
    * #swagger.tags = ["管理員 - Recipe 食譜"]
    * #swagger.summary = "取得所有食譜"
    * #swagger.description = "取得所有食譜"
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
    * #swagger.parameters["memberId"] = {
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
          "results": [
            {
              "_id": "6789f201862fb3b01124e466",
              "title": "雞肉丼飯",
              "coverImgUrl": "https://123.jpg",
              "isPublic": true,
              "category": "6747ffe7bbe060fd3f49a366",
              "user": {
                  "_id": "66ad12532a4c0826b5b65f66",
                  "nickName": "admin",
                  "avatarImgUrl": "https://123.jpg"
              },
              "cookingTime": "15-30 分鐘",
              "description": "日式風味的雞肉丼飯，簡單又快速，適合忙碌的工作日。",
              "servings": 2,
              "createdAt": "2025-01-17T11:05:00.000Z",
              "updatedAt": "2025-03-15T05:37:01.984Z",
              "tags": [
                  "67458c7b58e288bc86d66a88",
              ],
              "collectsCount": 2,
              "isRecommended": true
            }
          ],
          "pagination": {
            "totalPage": 1,
            "currentPage": 1,
            "hasPrev": false,
            "hasNext": false
          }
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(RecipeControllers.getMemberAllRecipes)
);

// 刪除指定食譜
router.delete(
  "/recipe/:recipeId",
  /**
    * #swagger.tags = ["管理員 - Recipe 食譜"]
    * #swagger.summary = "刪除指定食譜"
    * #swagger.description = "刪除指定食譜"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["recipeId"] = {
        in: "path",
        type: "string",
        required: true,
        description: "食譜 ID",
      }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "nutritionFacts": {
            "calories": 0,
            "protein": 0,
            "totalFat": 0,
            "totalCarb": 0,
            "sodium": 0,
            "sugar": 0
          },
          "_id": "66b50fa7e845914dc7268af3",
          "title": "CAROL 紅茶",
          "coverImgUrl": "https://123.png",
          "isPublic": true,
          "category": "66ad17220c1f2d5e934ba5d5",
          "user": {
            "_id": "66ad12712a4c0826b5b65f3e",
            "nickName": "carol",
            "avatarImgUrl": ""
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
          "createdAt": "2025-01-08T18:34:15.748Z",
          "updatedAt": "2025-01-08T19:03:11.666Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
  errorAsyncHandler(RecipeControllers.delRecipe)
);

// 刪除指定會員所有食譜
router.delete(
  "/recipes/member/:memberId",
  /**
    * #swagger.tags = ["管理員 - Recipe 食譜"]
    * #swagger.summary = "刪除指定會員所有食譜"
    * #swagger.description = "刪除指定會員所有食譜"
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
  errorAsyncHandler(RecipeControllers.delMemberAllRecipes)
);

// 刪除所有食譜
router.delete(
  "/recipes",
  /**
    * #swagger.tags = ["管理員 - Recipe 食譜"]
    * #swagger.summary = "刪除所有食譜"
    * #swagger.description = "刪除所有食譜"
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
  errorAsyncHandler(RecipeControllers.delAllRecipes)
);

module.exports = router;

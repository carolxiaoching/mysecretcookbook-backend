const mongoose = require("mongoose");
const validator = require("validator");
const appError = require("../services/appError");
// const Tag = require("../../models/tag");

const validationUtils = {
  // 驗證 ObjectId 格式
  isValidObjectId(id) {
    return mongoose.isObjectIdOrHexString(id);
  },

  // 驗證 Id 是否存在資料庫中
  async isIdExist(Model, id) {
    const isExist = await Model.findById(id).exec();
    return isExist;
  },

  // 驗證傳入的物件有值
  isObjectEmpty(object) {
    return Object.keys(object).length > 0;
  },

  // 驗證字串是否有效，最少 1 個字元，最多 100 字元
  isValidString(value, minLength = 1, maxLength = 100) {
    return (
      typeof value === "string" &&
      validator.isLength(value.trim(), { min: minLength, max: maxLength })
    );
  },

  // 驗證數字是否有效，最小值為 0, 最少 1 個字元，最多 10 字元
  isValidNumber(num, minValue = 0, minLength = 1, maxLength = 10) {
    return (
      typeof num === "number" &&
      validator.isLength(value.trim(), { min: minLength, max: maxLength }) &&
      num >= minValue
    );
  },

  // 驗證網址是否有效
  isValidUrl(url) {
    return (
      this.isValidString(url, 1, 1000) &&
      validator.isURL(url, {
        protocols: ["http", "https"],
        require_protocol: true,
      })
    );
  },

  // 驗證密碼是否有效
  isValidPassword(password) {
    return (
      this.isValidString(password, 8, 30) &&
      validator.isStrongPassword(password, {
        minLength: 8, // 最小字元數
        minLowercase: 1, // 最少小寫字母數量
        minUppercase: 0, // 最少大寫字母數量
        minNumbers: 1, // 最少數字數量
        minSymbols: 0, // 標點符號數量
      })
    );
  },

  // 驗證電子信箱是否有效
  isValidEmail(email) {
    return this.isValidString(email) && validator.isEmail(email);
  },

  // 驗證標籤欄位是否正確
  async isValidTags(tags) {
    // 驗證標籤欄位是否為陣列，陣列長度是否在3 以下
    if (!Array.isArray(tags) || tags.length <= 3) {
      return false;
    }

    // 檢查標籤陣列裡面的值
    for (const tagItem of tags) {
      // 驗值標籤是否為字串與是否符合 ObjectId 格式
      if (!this.isValidString(tagItem) || !this.isValidObjectId(tagItem)) {
        return false;
      }

      // 確認標籤 ID 是否存在在 Tag 資料庫中
      const exists = await this.isIdExist(Tag, tagItem);
      if (!exists) {
        return exists;
      }
    }

    return true;

    // try {
    //   // 對每個 tag 進行驗證，返回一個 Promise 陣列
    //   const validationPromises = tags.map(async (tag) => {
    //     // 同步檢查可以直接執行
    //     if (!this.isValidString(tag)) return false;
    //     if (!this.isValidObjectId(tag)) return false;

    //     // 非同步檢查
    //     const exists = await this.isIdExist(Model, tag);
    //     return exists;
    //   });

    //   // 等待所有驗證完成
    //   const results = await Promise.all(validationPromises);

    //   // 確保所有驗證都通過
    //   return results.every((result) => result === true);
    // } catch (error) {
    //   return false;
    // }

    // return (
    //   Array.isArray(tags) &&
    //   tags.length <= 3 &&
    //   // tags.every(
    //   //   (tag) =>
    //   //     this.isValidString(tag) &&
    //   //     this.isValidObjectId(tag) &&
    //   //     (await this.isIdExist(Model, tag))
    //   // )
    //   tags.every(
    //     async (tag) =>
    //       this.isValidString(tag) &&
    //       this.isValidObjectId(tag) &&
    //       (await this.isIdExist(Model, tag))
    //   )
    // );
  },

  // 驗證營養資訊欄位是否正確
  isValidNutritionFacts(nutritionFacts) {
    const validFields = [
      "calories",
      "protein",
      "totalFat",
      "totalCarb",
      "sodium",
      "sugar",
    ];
    return (
      typeof nutritionFacts === "object" &&
      nutritionFacts !== null &&
      validFields.every((field) => this.isValidNumber(nutritionFacts[field], 0))
    );
  },

  // 驗證食材欄位是否正確
  isValidIngredients(ingredients) {
    return (
      Array.isArray(ingredients) &&
      ingredients.length > 0 &&
      ingredients.every(
        ({ ingredientName, ingredientQty }) =>
          this.isValidString(ingredientName) &&
          this.isValidString(ingredientQty)
      )
    );
  },

  // 驗證步驟欄位是否正確
  isValidSteps(steps) {
    return (
      Array.isArray(steps) &&
      steps.length > 0 &&
      steps.every(
        ({ stepOrder, stepContent }) =>
          this.isValidNumber(stepOrder, 1) && this.isValidString(stepContent)
      )
    );
  },

  // 使用驗證規則陣列逐一檢查資料，若任何一個規則的條件為 true，則立即回傳錯誤
  async checkValidation(validations, next) {
    for (const validation of validations) {
      if (validation.condition) {
        return appError(400, validation.message, next);
      }
    }
  },
};

module.exports = validationUtils;

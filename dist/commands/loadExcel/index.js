"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const getAbsolutePath_1 = require("../../utils/getAbsolutePath");
const initConfig_1 = require("../../utils/initConfig");
const getLocaleDir_1 = require("../../utils/getLocaleDir");
const stateManager_1 = __importDefault(require("../../utils/stateManager"));
const saveLocaleFile_1 = require("../../utils/saveLocaleFile");
const log_1 = __importDefault(require("../../utils/log"));
const spreadObject_1 = require("../../utils/spreadObject");
function getLangList(locales, rows) {
    const langList = [];
    const result = [];
    locales.forEach((locale, i) => {
        // 创建一个对象，存储该语言的翻译
        langList.push({});
        rows.forEach((row) => {
            const key = row[0];
            const value = row[i + 1];
            langList[i][key] = value;
        });
        // 对象的key可能是xx.xx这种形式，需要转成{xx:{xx:1}}
        result[i] = (0, spreadObject_1.spreadObject)(langList[i]);
    });
    return result;
}
function execLoadExcel(options) {
    log_1.default.info(`正在导入excel翻译文件`);
    const i18nConfig = (0, initConfig_1.getI18nConfig)(options);
    // 全局缓存脚手架配置
    stateManager_1.default.setToolConfig(i18nConfig);
    const { excelPath } = i18nConfig;
    const xlsxData = node_xlsx_1.default.parse((0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), excelPath))[0].data;
    if (xlsxData.length === 0) {
        return;
    }
    // 获取待生成的语言
    const locales = xlsxData[0].slice(1);
    const rows = xlsxData.slice(1);
    const langList = getLangList(locales, rows);
    // 将excel翻译内容更新到本地
    locales.forEach((locale, i) => {
        const localeDirPath = (0, getLocaleDir_1.getLocaleDir)();
        const currentLocalePath = (0, getAbsolutePath_1.getAbsolutePath)(localeDirPath, `${locale}.${i18nConfig.localeFileType}`);
        const localePack = langList[i];
        log_1.default.verbose(`写入到指定文件:`, currentLocalePath);
        (0, saveLocaleFile_1.saveLocaleFile)(localePack, currentLocalePath);
    });
    log_1.default.success(`导入完毕!`);
}
exports.default = execLoadExcel;
//# sourceMappingURL=index.js.map
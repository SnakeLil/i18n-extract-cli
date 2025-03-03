"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const stateManager_1 = __importDefault(require("./utils/stateManager"));
const excelUtil_1 = require("./utils/excelUtil");
const getAbsolutePath_1 = require("./utils/getAbsolutePath");
const getLang_1 = __importDefault(require("./utils/getLang"));
const log_1 = __importDefault(require("./utils/log"));
const getLocaleDir_1 = require("./utils/getLocaleDir");
const flatObjectDeep_1 = require("./utils/flatObjectDeep");
function exportExcel() {
    var _a, _b;
    const { localeFileType, excelPath } = stateManager_1.default.getToolConfig();
    const headers = (0, excelUtil_1.getExcelHeader)();
    const matchResult = (_a = excelPath.match(new RegExp(`([A-Za-z-]+.xlsx)`, 'g'))) !== null && _a !== void 0 ? _a : [];
    const excelFileName = (_b = matchResult[0]) !== null && _b !== void 0 ? _b : '';
    // 获取语言包存放路径
    const localeDirPath = (0, getLocaleDir_1.getLocaleDir)();
    const locales = headers.slice(1);
    // 遍历每个语言包，并组成excel的data
    const data = [];
    for (const locale of locales) {
        const currentLocalePath = (0, getAbsolutePath_1.getAbsolutePath)(localeDirPath, `${locale}.${localeFileType}`);
        let lang = {};
        if (fs_extra_1.default.existsSync(currentLocalePath)) {
            lang = (0, getLang_1.default)(currentLocalePath);
        }
        else {
            log_1.default.error(`${locale}语言包不存在`);
            break;
        }
        // 遍历中文时，存入key和value，并创建数据行
        if (locale === 'zh-CN') {
            let rowIndex = 0;
            const keyValueMap = (0, flatObjectDeep_1.flatObjectDeep)(lang);
            Object.keys(keyValueMap).forEach((key) => {
                data.push([]);
                data[rowIndex].push(key); // 放入字段key
                data[rowIndex].push(keyValueMap[key]); // 放入中文翻译
                rowIndex++;
            });
        }
        else {
            // 其他语言，按中文字典key，把对应的语言翻译结果填入表格
            let rowIndex = 0;
            const keyValueMap = (0, flatObjectDeep_1.flatObjectDeep)(lang);
            Object.keys(keyValueMap).forEach((key) => {
                if (data[rowIndex]) {
                    data[rowIndex].push(keyValueMap[key]);
                }
                rowIndex++;
            });
        }
    }
    const excelBuffer = (0, excelUtil_1.buildExcel)(headers, data, excelFileName);
    const excelData = new Uint8Array(excelBuffer, excelBuffer.byteOffset, excelBuffer.length);
    fs_extra_1.default.writeFileSync((0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), excelPath), excelData, 'utf8');
}
exports.default = exportExcel;
//# sourceMappingURL=exportExcel.js.map
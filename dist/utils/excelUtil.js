"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildExcel = exports.getExcelHeader = void 0;
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const stateManager_1 = __importDefault(require("./stateManager"));
function getExcelHeader() {
    const { locales } = stateManager_1.default.getToolConfig();
    const header = ['字典key', 'zh-CN'];
    for (const locale of locales) {
        header.push(locale.locale);
    }
    return header;
}
exports.getExcelHeader = getExcelHeader;
function buildExcel(headers, data, name) {
    const sheetOptions = {};
    sheetOptions['!cols'] = [];
    headers.forEach(() => {
        sheetOptions['!cols'].push({
            wch: 50, // 表格列宽
        });
    });
    data.unshift(headers);
    const buffer = node_xlsx_1.default.build([{ options: {}, name, data }], { sheetOptions });
    return buffer;
}
exports.buildExcel = buildExcel;
//# sourceMappingURL=excelUtil.js.map
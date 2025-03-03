"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("./log"));
class ErrorLogger {
    constructor() {
        this._filerPath = '';
        this._errorList = [];
        this._delimiter = '\n=======================================\n';
    }
    setFilePath(path) {
        this._filerPath = path;
    }
    reportFileError(errorMessage) {
        this._errorList.push(`${this._delimiter}解析${this._filerPath}文件时遇到未知错误：\n${errorMessage}\n\n已跳过文件转换，请手动处理${this._delimiter}`);
    }
    reportTemplateError(originSource, errorMessage) {
        this._errorList.push(`${this._delimiter}解析${this._filerPath}文件里的模版内容\n${originSource}\n时遇到未知错误：\n${errorMessage}\n\n已跳过此段模版转换，请手动处理${this._delimiter}`);
    }
    printErrors() {
        if (this._errorList.length === 0) {
            return;
        }
        this._errorList.forEach((err) => {
            log_1.default.error(err);
        });
        log_1.default.error(`总计出现 ${this._errorList.length} 处错误，需要手动处理。建议去issue里反馈相关问题https://github.com/IFreeOvO/i18n-cli/issues，以协助作者完善代码♪(･ω･)ﾉ`);
    }
}
exports.default = new ErrorLogger();
//# sourceMappingURL=error-logger.js.map
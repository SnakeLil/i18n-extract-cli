"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("./utils/log"));
const removeLineBreaksInTag_1 = require("./utils/removeLineBreaksInTag");
const escapeQuotes_1 = require("./utils/escapeQuotes");
class Collector {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        this.keyMap = {};
        // 记录每个文件执行提取的次数
        this.countOfAdditions = 0;
        // 记录单个文件里提取的中文，键为自定义key，值为原始中文key
        this.currentFileKeyMap = {};
        this.currentFilePath = '';
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Collector();
        }
        return this._instance;
    }
    setCurrentCollectorPath(path) {
        this.currentFilePath = path;
    }
    getCurrentCollectorPath() {
        return this.currentFilePath;
    }
    add(originalText, customizeKeyFn) {
        const formattedText = (0, removeLineBreaksInTag_1.removeLineBreaksInTag)(originalText);
        const translationKey = customizeKeyFn((0, escapeQuotes_1.escapeQuotes)(formattedText), this.currentFilePath); // key中不能包含回车
        log_1.default.verbose('提取中文：', formattedText);
        this.keyMap[translationKey] = formattedText.replace('|', "{'|'}"); // '|' 管道符在vue-i18n表示复数形式,需要特殊处理。见https://vue-i18n.intlify.dev/guide/essentials/pluralization.html
        this.countOfAdditions++;
        this.currentFileKeyMap[translationKey] = formattedText;
        return translationKey;
    }
    getCurrentFileKeyMap() {
        return this.currentFileKeyMap;
    }
    resetCurrentFileKeyMap() {
        this.currentFileKeyMap = {};
    }
    getKeyMap() {
        return this.keyMap;
    }
    setKeyMap(value) {
        this.keyMap = value;
    }
    resetCountOfAdditions() {
        this.countOfAdditions = 0;
    }
    getCountOfAdditions() {
        return this.countOfAdditions;
    }
}
exports.default = Collector.getInstance();
//# sourceMappingURL=collector.js.map
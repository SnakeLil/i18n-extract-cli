"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocaleDir = void 0;
const stateManager_1 = __importDefault(require("./stateManager"));
function getLocaleDir() {
    const { localeFileType, localePath } = stateManager_1.default.getToolConfig();
    const reg = new RegExp(`/[A-Za-z-]+.${localeFileType}`, 'g');
    const localeDirPath = localePath.replace(reg, '');
    return localeDirPath;
}
exports.getLocaleDir = getLocaleDir;
//# sourceMappingURL=getLocaleDir.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLocaleFile = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const stateManager_1 = __importDefault(require("./stateManager"));
const serializeCode_1 = require("./serializeCode");
function saveLocaleFile(locale, path) {
    const { localeFileType } = stateManager_1.default.getToolConfig();
    if (!fs_extra_1.default.existsSync(path)) {
        fs_extra_1.default.ensureFileSync(path);
    }
    if (localeFileType === 'json') {
        fs_extra_1.default.writeFileSync(path, JSON.stringify(locale, null, 2), 'utf8');
    }
    else {
        fs_extra_1.default.writeFileSync(path, (0, serializeCode_1.serializeCode)(locale), 'utf8');
    }
}
exports.saveLocaleFile = saveLocaleFile;
//# sourceMappingURL=saveLocaleFile.js.map
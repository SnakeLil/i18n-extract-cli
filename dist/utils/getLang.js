"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const stateManager_1 = __importDefault(require("./stateManager"));
const log_1 = __importDefault(require("./log"));
function getLang(langPath) {
    const localeFileType = stateManager_1.default.getToolConfig().localeFileType;
    try {
        if (localeFileType === 'json') {
            // json文件直接require拿不到文件内容，故改成下面写法
            const content = fs_extra_1.default.readFileSync(langPath).toString();
            if (!content) {
                return {};
            }
            return JSON.parse(content);
        }
        else {
            if (!fs_extra_1.default.existsSync(langPath)) {
                log_1.default.error(`文件${langPath}不存在`);
                return {};
            }
            // TODO: 因为默认生成的是esm的js文件，先简单处理下。后期还是兼容esm和commonjs比较好
            const str = fs_extra_1.default.readFileSync(langPath).toString().replace('export default', 'return');
            const content = new Function(str)();
            return content;
        }
    }
    catch (e) {
        log_1.default.error(`读取文件路径${langPath}出错:`, e);
        return {};
    }
}
exports.default = getLang;
//# sourceMappingURL=getLang.js.map
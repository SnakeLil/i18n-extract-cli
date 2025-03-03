"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const transformJs_1 = __importDefault(require("./transformJs"));
const transformVue_1 = __importDefault(require("./transformVue"));
const parse_1 = require("./parse");
function transform(code, ext, rules, filePath) {
    var _a;
    switch (ext) {
        case 'cjs':
        case 'mjs':
        case 'js':
        case 'jsx':
            return (0, transformJs_1.default)(code, {
                rule: rules[ext],
                parse: (0, parse_1.initParse)(),
            });
        case 'ts':
        case 'tsx':
            return (0, transformJs_1.default)(code, {
                rule: rules[ext],
                parse: (0, parse_1.initParse)(),
            });
        case 'vue':
            // 规则functionName废弃掉，使用functionNameInScript代替
            rules[ext].functionName = (_a = rules[ext].functionNameInScript) !== null && _a !== void 0 ? _a : '';
            return (0, transformVue_1.default)(code, {
                rule: rules[ext],
                filePath,
            });
        default:
            throw new Error(chalk_1.default.red(`不支持对.${ext}后缀的文件进行提取`));
    }
}
exports.default = transform;
//# sourceMappingURL=transform.js.map
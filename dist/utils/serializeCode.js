"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCode = void 0;
const prettier_1 = __importDefault(require("prettier"));
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
function serializeCode(source, isESModule = true) {
    const exportStatement = isESModule ? 'export default' : 'module.exports =';
    const code = `
  ${exportStatement} ${(0, serialize_javascript_1.default)(source, {
        unsafe: true,
    })}
  `;
    const stylizedCode = prettier_1.default.format(code, {
        semi: false,
        singleQuote: true,
        parser: 'babel',
    });
    return stylizedCode;
}
exports.serializeCode = serializeCode;
//# sourceMappingURL=serializeCode.js.map
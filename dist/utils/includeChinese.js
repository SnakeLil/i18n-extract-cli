"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeChinese = void 0;
function includeChinese(code) {
    return new RegExp('[\u{4E00}-\u{9FFF}]', 'g').test(code);
}
exports.includeChinese = includeChinese;
//# sourceMappingURL=includeChinese.js.map
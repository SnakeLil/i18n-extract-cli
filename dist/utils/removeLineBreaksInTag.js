"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLineBreaksInTag = void 0;
function removeLineBreaksInTag(str) {
    return str.replace(/([\r\n]+\s*)+/g, '');
}
exports.removeLineBreaksInTag = removeLineBreaksInTag;
//# sourceMappingURL=removeLineBreaksInTag.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeQuotes = void 0;
function escapeQuotes(value) {
    return value.replace(/'/g, '_#_').replace(/"/g, '_##_');
}
exports.escapeQuotes = escapeQuotes;
//# sourceMappingURL=escapeQuotes.js.map
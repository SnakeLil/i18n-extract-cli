"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spreadObject = void 0;
const set_1 = __importDefault(require("lodash/set"));
function spreadObject(obj) {
    const newObject = {};
    Object.keys(obj).forEach((key) => {
        const keyList = key.split('.');
        (0, set_1.default)(newObject, keyList, obj[key]);
    });
    return newObject;
}
exports.spreadObject = spreadObject;
//# sourceMappingURL=spreadObject.js.map
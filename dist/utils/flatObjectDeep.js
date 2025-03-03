"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatObjectDeep = void 0;
const assertType_1 = require("./assertType");
/**
 * @example
 * 将{a: {bb: 1}} 转成 {'a.bb': 1}
 */
function flatObjectDeep(data) {
    const keyValueMap = {};
    function collectMap(obj, upperKey) {
        Object.keys(obj).forEach((key) => {
            const currentKey = upperKey ? `${upperKey}.${key}` : key;
            const value = obj[key];
            if ((0, assertType_1.isObject)(value)) {
                collectMap(value, currentKey);
            }
            else {
                keyValueMap[currentKey] = value;
            }
        });
    }
    collectMap(data);
    return keyValueMap;
}
exports.flatObjectDeep = flatObjectDeep;
//# sourceMappingURL=flatObjectDeep.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const getAbsolutePath_1 = require("../../utils/getAbsolutePath");
const default_config_1 = __importDefault(require("../../default.config"));
const constants_1 = require("../../utils/constants");
const serializeCode_1 = require("../../utils/serializeCode");
function execInit() {
    const configPath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), constants_1.CONFIG_FILE_NAME);
    const code = (0, serializeCode_1.serializeCode)(default_config_1.default, false);
    fs_extra_1.default.outputFileSync(configPath, code);
}
exports.default = execInit;
//# sourceMappingURL=index.js.map
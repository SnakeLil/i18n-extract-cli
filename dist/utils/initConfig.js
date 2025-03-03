"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getI18nConfig = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const merge_1 = __importDefault(require("lodash/merge"));
const default_config_1 = __importDefault(require("../default.config"));
const getAbsolutePath_1 = require("./getAbsolutePath");
const log_1 = __importDefault(require("./log"));
function getUserConfig(configFile) {
    if (configFile) {
        const configPath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), configFile);
        if (!fs_extra_1.default.existsSync(configPath)) {
            log_1.default.warning('配置文件路径不存在，请重新设置指令参数 -c 或 --config-file 的值');
            return {};
        }
        else {
            const config = require(configPath);
            // prettier为true时删除，是为了走默认的配置
            if (config.prettier === true) {
                delete config.prettier;
            }
            return config;
        }
    }
    else {
        return {};
    }
}
function getI18nConfig(options) {
    const userConfig = getUserConfig(options.configFile);
    const config = (0, merge_1.default)(default_config_1.default, options, userConfig);
    return config;
}
exports.getI18nConfig = getI18nConfig;
//# sourceMappingURL=initConfig.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const log = {
    info: (msg) => console.log('\n' + chalk_1.default.cyan(msg)),
    warning: (msg) => console.log('\n' + chalk_1.default.yellow(msg)),
    success: (msg) => console.log('\n' + chalk_1.default.green(msg)),
    error: (msg1, msg2 = '') => console.log('\n' + chalk_1.default.red(msg1), chalk_1.default.red(msg2)),
    verbose: (label, msg = '') => process.env.CLI_VERBOSE && console.log('\n' + chalk_1.default.gray(label), msg),
    debug: (label, msg = '') => process.env.CLI_DEBUG && console.log('\n' + chalk_1.default.magenta(label), msg),
};
exports.default = log;
//# sourceMappingURL=log.js.map
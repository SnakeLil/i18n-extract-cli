"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initParse = void 0;
const node_path_1 = __importDefault(require("node:path"));
const stateManager_1 = __importDefault(require("./utils/stateManager"));
const babel = require('@babel/core');
const presetEnv = require('@babel/preset-env');
const presetReact = require('@babel/preset-react');
const typescriptPresets = require('@babel/preset-typescript');
const pluginSyntaxDecorators = require('@babel/plugin-syntax-decorators');
function langToExtension(lang = 'js') {
    switch (lang.toLowerCase()) {
        case 'js':
        case 'mjs':
        case 'javascript':
            return '.js';
        case 'ts':
        case 'typescript':
            return '.ts';
        case 'jsx':
            return '.jsx';
        case 'tsx':
            return '.tsx';
        default:
            throw new Error(`vue script标签里存在未知的lang属性值: ${lang}`);
    }
}
function getSourceFileName() {
    const sourcePath = stateManager_1.default.getCurrentSourcePath();
    const lang = stateManager_1.default.getVueScriptLang();
    const ext = node_path_1.default.extname(sourcePath);
    const isVueFile = ext === '.vue';
    const basename = node_path_1.default.basename(sourcePath, ext);
    const filename = isVueFile ? basename + langToExtension(lang) : basename + ext;
    return filename;
}
function initParse() {
    return function (code) {
        return babel.parseSync(code, {
            ast: true,
            configFile: false,
            filename: getSourceFileName(),
            presets: [presetEnv, presetReact, typescriptPresets],
            plugins: [[pluginSyntaxDecorators, { legacy: true }]],
        });
    };
}
exports.initParse = initParse;
//# sourceMappingURL=parse.js.map
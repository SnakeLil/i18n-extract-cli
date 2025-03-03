"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 参数path，在生成配置文件时需要展示在文件里，所以这里去掉eslint校验
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCustomizeKey(key, path) {
    return key;
}
function getCustomSlot(slotValue) {
    return `{${slotValue}}`;
}
function getCommonRule() {
    return {
        caller: '',
        functionName: 't',
        customizeKey: getCustomizeKey,
        customSlot: getCustomSlot,
        importDeclaration: 'import { t } from "i18n"',
    };
}
const config = {
    input: 'src',
    output: '',
    exclude: ['**/node_modules/**/*'],
    rules: {
        js: getCommonRule(),
        ts: getCommonRule(),
        cjs: getCommonRule(),
        mjs: getCommonRule(),
        jsx: {
            ...getCommonRule(),
            functionSnippets: '',
        },
        tsx: {
            ...getCommonRule(),
            functionSnippets: '',
        },
        vue: {
            caller: 'this',
            functionNameInTemplate: '$t',
            functionNameInScript: '$t',
            customizeKey: getCustomizeKey,
            customSlot: getCustomSlot,
            importDeclaration: '',
            tagOrder: ['template', 'script', 'style'],
        },
    },
    prettier: {
        semi: false,
        singleQuote: true,
    },
    incremental: true,
    skipExtract: false,
    localePath: './locales/zh-CN.json',
    localeFileType: 'json',
    excelPath: './locales.xlsx',
    exportExcel: false,
    skipTranslate: false,
    locales: [{ locale: 'en-US', path: 'i18n/en/translation.json' }],
    globalRule: {
        ignoreMethods: [],
    },
    // 参数currentFileKeyMap和currentFilePath，在生成配置文件时需要展示在文件里，所以这里去掉eslint校验
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adjustKeyMap(allKeyValue, currentFileKeyMap, currentFilePath) {
        return allKeyValue;
    },
};
exports.default = config;
//# sourceMappingURL=default.config.js.map
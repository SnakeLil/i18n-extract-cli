"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_sfc_1 = require("@vue/compiler-sfc");
const htmlparser2 = __importStar(require("htmlparser2"));
const prettier_1 = __importDefault(require("prettier"));
const mustache_1 = __importDefault(require("mustache"));
const ejs_1 = __importDefault(require("ejs"));
const includeChinese_1 = require("./utils/includeChinese");
const log_1 = __importDefault(require("./utils/log"));
const transformJs_1 = __importDefault(require("./transformJs"));
const parse_1 = require("./parse");
const collector_1 = __importDefault(require("./collector"));
const constants_1 = require("./utils/constants");
const stateManager_1 = __importDefault(require("./utils/stateManager"));
const error_logger_1 = __importDefault(require("./utils/error-logger"));
const COMMENT_TYPE = '!';
function parseJsSyntax(source, rule) {
    // html属性有可能是{xx:xx}这种对象形式，直接解析会报错，需要特殊处理。
    // 先处理成temp = {xx:xx} 让babel解析，解析完再还原成{xx:xx}
    let isObjectStruct = false;
    if (source.startsWith('{') && source.endsWith('}')) {
        isObjectStruct = true;
        source = `temp=${source}`;
    }
    const { code } = (0, transformJs_1.default)(source, {
        rule: {
            ...rule,
            functionName: rule.functionNameInTemplate,
            caller: '',
            importDeclaration: '',
        },
        parse: (0, parse_1.initParse)(),
    });
    let stylizedCode = prettier_1.default.format(code, {
        singleQuote: true,
        semi: false,
        parser: 'babel',
    });
    // pretter格式化后有时会多出分号
    if (stylizedCode.startsWith(';')) {
        stylizedCode = stylizedCode.slice(1);
    }
    if (isObjectStruct) {
        stylizedCode = stylizedCode.replace('temp = ', '');
    }
    return stylizedCode.endsWith('\n') ? stylizedCode.slice(0, stylizedCode.length - 1) : stylizedCode;
}
// 判断表达式是否已经转换成i18n
function hasTransformed(code, functionNameInTemplate) {
    return new RegExp(`\\${functionNameInTemplate}\\(.*\\)`, 'g').test(code);
}
// TODO: 需要优化，传参方式太挫
function parseTextNode(text, rule, getReplaceValue, customizeKey) {
    let str = '';
    let tokens = [];
    try {
        tokens = mustache_1.default.parse(text);
    }
    catch (err) {
        error_logger_1.default.reportTemplateError(text, err);
        return text;
    }
    for (const token of tokens) {
        const type = token[0];
        const value = token[1];
        if ((0, includeChinese_1.includeChinese)(value)) {
            if (type === 'text') {
                const translationKey = collector_1.default.add(value, customizeKey);
                str += `{{${getReplaceValue(translationKey)}}}`;
            }
            else if (type === 'name') {
                const source = parseJsSyntax(value, rule);
                str += `{{${source}}}`;
            }
            else if (type === COMMENT_TYPE) {
                // 形如{{!xxxx}}这种形式，在mustache里属于注释语法
                const source = parseJsSyntax(`!${value}`, rule);
                str += `{{${source}}}`;
            }
        }
        else {
            if (type === 'text') {
                str += value;
            }
            else if (type === 'name') {
                str += `{{${value}}}`;
            }
            else if (type === COMMENT_TYPE) {
                // 形如{{!xxxx}}这种形式，在mustache里属于注释语法
                str += `{{!${value}}}`;
            }
        }
    }
    return str;
}
function handleTemplate(code, rule) {
    let htmlString = '';
    const { functionNameInTemplate, customizeKey } = rule;
    function getReplaceValue(translationKey) {
        // 表达式结构 $t('xx')
        return `${functionNameInTemplate}('${translationKey}')`;
    }
    function parseIgnoredTagAttribute(attributes) {
        let attrs = '';
        for (const key in attributes) {
            const attrValue = attributes[key];
            if (attrValue === undefined) {
                attrs += ` ${key} `;
            }
            else {
                attrs += ` ${key}="${attrValue}" `;
            }
        }
        return attrs;
    }
    function parseTagAttribute(attributes) {
        let attrs = '';
        for (const key in attributes) {
            const attrValue = attributes[key];
            const isVueDirective = key.startsWith(':') || key.startsWith('@') || key.startsWith('v-');
            if (attrValue === undefined) {
                attrs += ` ${key} `;
            }
            else if ((0, includeChinese_1.includeChinese)(attrValue) && isVueDirective) {
                const source = parseJsSyntax(attrValue, rule);
                // 处理属性类似于:xx="'xx'"，这种属性值不是js表达式的情况。attrValue === source即属性值不是js表达式
                // !hasTransformed()是为了排除，类似:xx="$t('xx')"这种已经转化过的情况。这种情况不需要二次处理
                if (attrValue === source && !hasTransformed(source, functionNameInTemplate !== null && functionNameInTemplate !== void 0 ? functionNameInTemplate : '')) {
                    const translationKey = collector_1.default.add(removeQuotes(attrValue), customizeKey);
                    const expression = getReplaceValue(translationKey);
                    attrs += ` ${key}="${expression}" `;
                }
                else {
                    attrs += ` ${key}="${source}" `;
                }
            }
            else if ((0, includeChinese_1.includeChinese)(attrValue) && !isVueDirective) {
                const translationKey = collector_1.default.add(attrValue, (key, path) => {
                    // 属性里的$t('')转成$t(``)，并把双引号转成单引号
                    key = key.replace(/'/g, '`').replace(/"/g, "'");
                    return customizeKey(key, path);
                });
                const expression = getReplaceValue(translationKey);
                attrs += ` :${key}="${expression}" `;
            }
            else if (attrValue === '') {
                // 这里key=''是因为之后还会被pretttier处理一遍，所以写死单引号没什么影响
                attrs += `${key}='' `;
            }
            else {
                attrs += ` ${key}="${attrValue}" `;
            }
        }
        return attrs;
    }
    // 转义特殊字符
    function escapeSpecialChar(text) {
        text = text.replace(/&nbsp;/g, ' ');
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&quot;/g, '"');
        text = text.replace(/&amp;/g, '&');
        return text;
    }
    let shouldIgnore = false; // 是否忽略提取
    let textNodeCache = ''; // 缓存当前文本节点内容
    let attrsCache = {}; // 缓存当前标签的属性
    const ignoreTags = []; // 记录忽略提取的标签名
    const parser = new htmlparser2.Parser({
        onopentag(tagName) {
            // 处理文本节点没有被标签包裹的情况
            // 如果这个标签没被忽略提取，那么就进行文本节点解析
            if (!shouldIgnore) {
                const text = parseTextNode(textNodeCache, rule, getReplaceValue, customizeKey);
                htmlString += text;
                textNodeCache = '';
            }
            let attrs = '';
            const attributes = attrsCache;
            if (shouldIgnore) {
                ignoreTags.push(tagName);
                attrs = parseIgnoredTagAttribute(attributes);
                // 重置属性缓存
                attrsCache = {};
                htmlString += `<${tagName} ${attrs}>`;
                return;
            }
            attrs = parseTagAttribute(attributes);
            // 重置属性缓存
            attrsCache = {};
            htmlString += `<${tagName} ${attrs}>`;
        },
        onattribute(name, value, quote) {
            if (value) {
                attrsCache[name] = value;
            }
            else {
                if (quote === undefined) {
                    attrsCache[name] = undefined;
                }
                else {
                    attrsCache[name] = value;
                }
            }
        },
        ontext(text) {
            text = escapeSpecialChar(text);
            if (shouldIgnore) {
                htmlString += text;
                return;
            }
            textNodeCache += text;
        },
        onclosetag(tagName, isImplied) {
            // 处理文本被标签包裹的情况
            // 如果这个标签没被忽略提取，那么就进行文本节点解析
            if (!shouldIgnore) {
                const text = parseTextNode(textNodeCache, rule, getReplaceValue, customizeKey);
                htmlString += text;
                textNodeCache = '';
            }
            // 判断是否可以取消忽略提取
            if (ignoreTags.length === 0) {
                shouldIgnore = false;
            }
            else {
                if (ignoreTags[ignoreTags.length - 1] === tagName) {
                    ignoreTags.pop();
                    if (ignoreTags.length === 0) {
                        shouldIgnore = false;
                    }
                }
            }
            // 如果是自闭合标签
            if (isImplied) {
                htmlString = htmlString.slice(0, htmlString.length - 2) + '/>';
                return;
            }
            htmlString += `</${tagName}>`;
        },
        oncomment(comment) {
            // 如果注释前有文本节点，就拼接
            const text = parseTextNode(textNodeCache, rule, getReplaceValue, customizeKey);
            htmlString += text;
            textNodeCache = '';
            if (comment.includes(constants_1.IGNORE_REMARK)) {
                shouldIgnore = true;
            }
            htmlString += `<!--${comment}-->`;
        },
    }, {
        lowerCaseTags: false,
        recognizeSelfClosing: true,
        lowerCaseAttributeNames: false,
        decodeEntities: false,
    });
    parser.write(code);
    parser.end();
    return htmlString;
}
function getComponentDecoratorPosition(source) {
    return source.indexOf('@Component');
}
function getExportDefaultPosition(source) {
    return source.indexOf('export default');
}
function handleScript(source, rule) {
    const lang = stateManager_1.default.getVueScriptLang().toLowerCase();
    if (['ts', 'typescript', 'tsx'].includes(lang)) {
        // 如果vue用了ts，按@Component装饰器进行分割
        const startIndex = getComponentDecoratorPosition(source);
        return combineVueScript(source.slice(0, startIndex), source.slice(startIndex), rule);
    }
    else {
        const startIndex = getExportDefaultPosition(source);
        return combineVueScript(source.slice(0, startIndex), source.slice(startIndex), rule);
    }
}
function combineVueScript(nonComponentCode, componentCode, rule) {
    const transformOptions = {
        rule: {
            ...rule,
            functionName: rule.functionNameInScript,
        },
        isJsInVue: true,
        parse: (0, parse_1.initParse)(),
    };
    const lang = stateManager_1.default.getVueScriptLang().toLowerCase();
    const transformedNonComponentCode = (0, transformJs_1.default)(nonComponentCode, {
        ...transformOptions,
        rule: ['ts', 'typescript', 'tsx'].includes(lang)
            ? stateManager_1.default.getToolConfig().rules.ts
            : stateManager_1.default.getToolConfig().rules.js,
    }).code;
    const transformedComponentCode = (0, transformJs_1.default)(componentCode, transformOptions).code;
    if (transformedNonComponentCode) {
        return '\n' + transformedNonComponentCode + '\n' + transformedComponentCode + '\n';
    }
    else {
        return transformedComponentCode + '\n';
    }
}
function mergeCode(tagOrder, tagMap) {
    const sourceCode = tagOrder.reduce((code, tagName) => {
        return code + tagMap[tagName];
    }, '');
    return sourceCode;
}
function removeQuotes(value) {
    if (['"', "'"].includes(value.charAt(0)) && ['"', "'"].includes(value.charAt(value.length - 1))) {
        value = value.substring(1, value.length - 1);
    }
    return value;
}
function getWrapperTemplate(sfcBlock) {
    const { type, lang, attrs } = sfcBlock;
    let template = `<${type}`;
    if (lang) {
        template += ` lang="${lang}"`;
    }
    if (sfcBlock.setup) {
        template += ` setup`;
    }
    if (sfcBlock.scoped) {
        template += ` scoped`;
    }
    for (const attr in attrs) {
        if (!['lang', 'scoped', 'setup'].includes(attr)) {
            if (attrs[attr] === true) {
                template += attr;
            }
            else {
                template += ` ${attr}="${attrs[attr]}"`;
            }
        }
    }
    template += `><%- code %></${type}>`;
    return template;
}
function generateSource(sfcBlock, handler, rule) {
    const wrapperTemplate = getWrapperTemplate(sfcBlock);
    let source;
    try {
        source = handler(sfcBlock.content, rule);
    }
    catch (err) {
        source = sfcBlock.content;
        error_logger_1.default.reportFileError(err.message);
    }
    return ejs_1.default.render(wrapperTemplate, {
        code: source,
    });
}
function removeSnippet(source, sfcBlock) {
    return sfcBlock ? source.replace(sfcBlock.content, '') : source;
}
// 提取文件头注释
// TODO: 这里投机取巧了一下，把标签内容清空再匹配注释。避免匹配错了。后期有好的方案再替换
function getFileComment(descriptor) {
    const { template, script, scriptSetup, styles } = descriptor;
    let source = descriptor.source;
    source = removeSnippet(source, template);
    source = removeSnippet(source, script);
    source = removeSnippet(source, scriptSetup);
    if (styles) {
        for (const style of styles) {
            source = removeSnippet(source, style);
        }
    }
    const result = source.match(/<!--[\s\S]*?-->/);
    return result ? result[0] : '';
}
function transformVue(code, options) {
    const { rule, filePath } = options;
    const { descriptor, errors } = (0, compiler_sfc_1.parse)(code);
    if (errors.length > 0) {
        const line = errors[0].loc.start.line;
        log_1.default.error(`源文件${filePath}第${line}行附近解析出现错误：`, errors[0].toString());
        return {
            code,
        };
    }
    const { template, script, scriptSetup, styles } = descriptor;
    let templateCode = '';
    let scriptCode = '';
    let stylesCode = '';
    const fileComment = getFileComment(descriptor);
    if (template) {
        templateCode = generateSource(template, handleTemplate, rule);
    }
    if (script) {
        stateManager_1.default.setVueScriptLang(script.lang);
        scriptCode = generateSource(script, handleScript, rule);
    }
    if (scriptSetup) {
        stateManager_1.default.setVueScriptLang(scriptSetup === null || scriptSetup === void 0 ? void 0 : scriptSetup.lang);
        scriptCode = generateSource(scriptSetup, handleScript, rule);
    }
    if (styles) {
        for (const style of styles) {
            const wrapperTemplate = getWrapperTemplate(style);
            const source = style.content;
            stylesCode +=
                ejs_1.default.render(wrapperTemplate, {
                    code: source,
                }) + '\n';
        }
    }
    const tagMap = {
        template: templateCode,
        script: scriptCode,
        style: stylesCode,
    };
    const tagOrder = stateManager_1.default.getToolConfig().rules.vue.tagOrder;
    code = mergeCode(tagOrder, tagMap);
    if (fileComment) {
        code = fileComment + code;
    }
    return {
        code,
    };
}
exports.default = transformVue;
//# sourceMappingURL=transformVue.js.map
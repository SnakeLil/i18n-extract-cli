"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const leven_1 = __importDefault(require("leven"));
const minimist_1 = __importDefault(require("minimist"));
const core_1 = __importDefault(require("./core"));
const chalk = require('chalk');
commander_1.program
    .version(`${process.env.PACKAGE_NAME} ${process.env.PACKAGE_VERSION}`)
    .usage('[command] [options]');
commander_1.program
    .option('-i, --input <path>', '输入文件路径')
    .option('-o, --output <path>', '输出文件路径')
    .option('-c, --config-file <path>', '配置文件所在路径')
    .option('-v, --verbose', '控制台打印更多调试信息')
    .option('--skip-extract', '跳过中文提取阶段')
    .option('--skip-translate', '跳过中文翻译阶段')
    .option('--locales <locales...>', '根据中文语言包自动翻译成其他语言')
    .option('--localePath <path>', '指定提取的中文语言包所存放的路径')
    .option('--excelPath <path>', '语言包excel的存放路径')
    .option('--exportExcel', '将所有翻译导入到excel。用于人工校对翻译')
    .action((options) => {
    (0, core_1.default)(options);
});
commander_1.program
    .command('init')
    .description('在项目里初始化一个配置文件')
    .action(() => {
    require('./commands/init/index').default();
});
commander_1.program
    .command('loadExcel')
    .description('导入翻译语言的excel')
    .option('-v, --verbose', '控制台打印更多调试信息')
    .option('-c, --config-file <path>', '配置文件所在路径')
    .option('--localePath <path>', '指定提取的中文语言包所存放的路径')
    .option('--excelPath <path>', '语言包excel的存放路径')
    .action(() => {
    // TODO: 不知道为什么，这里commander没有直接返回指令参数，先用minimist自己处理
    const options = (0, minimist_1.default)(process.argv.slice(3));
    if (options.c) {
        options.configFile = options.c;
    }
    require('./commands/loadExcel').default(options);
});
commander_1.program.addOption(new commander_1.Option('-d, --debug').hideHelp());
commander_1.program.on('option:verbose', function () {
    process.env.CLI_VERBOSE = commander_1.program.opts().verbose;
});
commander_1.program.on('option:debug', function () {
    process.env.CLI_DEBUG = commander_1.program.opts().debug;
});
enhanceErrorMessages();
commander_1.program.parse(process.argv);
function enhanceErrorMessages() {
    commander_1.program.Command.prototype['unknownOption'] = function (...options) {
        const unknownOption = options[0];
        this.outputHelp();
        console.log();
        console.log(`  ` + chalk.red(`Unknown option ${chalk.yellow(unknownOption)}.`));
        if (unknownOption.startsWith('--')) {
            suggestCommands(unknownOption.slice(2, unknownOption.length));
        }
        console.log();
        process.exit(1);
    };
}
function suggestCommands(unknownOption) {
    const availableOptions = ['input', 'output', 'config-file'];
    let suggestion;
    availableOptions.forEach((name) => {
        const isBestMatch = (0, leven_1.default)(name, unknownOption) < (0, leven_1.default)(suggestion || '', unknownOption);
        if ((0, leven_1.default)(name, unknownOption) < 3 && isBestMatch) {
            suggestion = name;
        }
    });
    if (suggestion) {
        console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(`--${suggestion}`)}?`));
    }
}
//# sourceMappingURL=index.js.map
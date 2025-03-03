import type { Config } from '../../types';
declare class StateManager {
    private static _instance;
    private constructor();
    private toolConfig;
    private currentSourcePath;
    private vueScriptLang;
    static getInstance(): StateManager;
    setToolConfig(config: Config): void;
    getToolConfig(): Config;
    setCurrentSourcePath(path: string): void;
    getCurrentSourcePath(): string;
    setVueScriptLang(lang?: string): void;
    getVueScriptLang(): string;
}
declare const _default: StateManager;
export default _default;

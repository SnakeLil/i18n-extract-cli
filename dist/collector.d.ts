import type { CustomizeKey, StringObject } from '../types';
declare class Collector {
    private static _instance;
    private constructor();
    static getInstance(): Collector;
    private keyMap;
    private countOfAdditions;
    private currentFileKeyMap;
    private currentFilePath;
    setCurrentCollectorPath(path: string): void;
    getCurrentCollectorPath(): string;
    add(originalText: string, customizeKeyFn: CustomizeKey): string;
    getCurrentFileKeyMap(): Record<string, string>;
    resetCurrentFileKeyMap(): void;
    getKeyMap(): StringObject;
    setKeyMap(value: StringObject): void;
    resetCountOfAdditions(): void;
    getCountOfAdditions(): number;
}
declare const _default: Collector;
export default _default;

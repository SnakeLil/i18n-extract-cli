declare class ErrorLogger {
    private _filerPath;
    private _errorList;
    private _delimiter;
    setFilePath(path: string): void;
    reportFileError(errorMessage: string): void;
    reportTemplateError(originSource: string, errorMessage: string): void;
    printErrors(): void;
}
declare const _default: ErrorLogger;
export default _default;

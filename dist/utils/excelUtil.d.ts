/// <reference types="node" />
export declare function getExcelHeader(): string[];
export declare function buildExcel(headers: string[], data: string[][], name: string): Buffer;

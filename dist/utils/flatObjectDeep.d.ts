import type { StringObject } from '../../types';
/**
 * @example
 * 将{a: {bb: 1}} 转成 {'a.bb': 1}
 */
export declare function flatObjectDeep(data: StringObject): Record<string, string>;

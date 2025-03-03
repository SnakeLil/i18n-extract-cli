import type { Rules, FileExtension } from '../types';
declare function transform(code: string, ext: FileExtension, rules: Rules, filePath: string): {
    code: string;
};
export default transform;

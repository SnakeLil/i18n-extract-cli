import type { GeneratorResult } from '@babel/generator';
import type { transformOptions } from '../types';
declare function transformJs(code: string, options: transformOptions): GeneratorResult;
export default transformJs;

import type { transformOptions } from '../types';
declare function transformVue(code: string, options: Omit<transformOptions, 'parse'>): {
    code: string;
};
export default transformVue;

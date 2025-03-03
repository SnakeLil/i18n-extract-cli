declare const log: {
    info: (msg: string) => void;
    warning: (msg: string) => void;
    success: (msg: string) => void;
    error: (msg1: unknown, msg2?: unknown) => void;
    verbose: (label: string, msg?: unknown) => void | "" | undefined;
    debug: (label: string, msg?: unknown) => void | "" | undefined;
};
export default log;

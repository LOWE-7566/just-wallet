export declare class ErrorLogger extends Error {
    data: any;
    suggestion?: string;
    _isError: boolean;
    code: string;
    constructor(code: string, message: string, data: any, suggest?: string);
}
export declare class ArgurmentError extends ErrorLogger {
    constructor(ofInstance: string, data: any, parameter: string, value: any, required: string, suggest?: string);
}
export declare class ExecutionError extends ErrorLogger {
    constructor(calling: string, data: any, suggest?: string);
}
export default ErrorLogger;
//# sourceMappingURL=Error.d.ts.map
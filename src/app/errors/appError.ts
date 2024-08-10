import { IErrorSources } from '../interfaces/errorSource';

class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    status: string;
    errorSources: IErrorSources[];

    constructor(
        statusCode: number,
        message: string | undefined,
        errorSources: IErrorSources[] = [],
        stack = '',
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errorSources = errorSources.length
            ? errorSources
            : [{ path: '', message: this.message || 'No error source found' }];
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError;

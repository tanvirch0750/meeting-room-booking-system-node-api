import AppError from '../appError';

import httpStatus from 'http-status';
import mongoose, { CastError } from 'mongoose';
import { ZodError, ZodIssue } from 'zod';
import { IErrorSources } from '../../interfaces/errorSource';

export const handleCastErrorDB = (err: CastError) => {
    const errorSourceObj = [
        {
            path: err.path,
            message: `Nothing found with this ${err.value} id`,
        },
    ];
    const message = `Invalid Id`;
    return new AppError(httpStatus.NOT_FOUND, message, errorSourceObj);
};

export const handleDuplicateFieldsErrorDB = (err: any) => {
    const path = Object?.keys(err?.keyValue)[0];
    const value = Object?.values(err?.keyValue)[0];
    const errorSourceObj = [
        {
            path: path,
            message: `Duplicate field ${path}, value: ${value}`,
        },
    ];
    const message = `Duplicate ${path}`;
    return new AppError(httpStatus.NOT_FOUND, message, errorSourceObj);
};

export const handleValidationErrorDB = (
    err: mongoose.Error.ValidationError,
) => {
    const errorsSourceObj: IErrorSources[] = Object.values(err.errors).map(
        (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: el.path,
                message: el.message,
            };
        },
    );

    const message = `Validation Error`;
    return new AppError(400, message, errorsSourceObj);
};

export const handleZodError = (error: ZodError) => {
    const errorsSourceObj: IErrorSources[] = error.issues.map(
        (issue: ZodIssue) => {
            return {
                path: issue?.path[issue.path.length - 1],
                message: issue?.message,
            };
        },
    );

    const message = `Validation Error`;
    return new AppError(400, message, errorsSourceObj);
};

export const handleBadValueError = () => {
    const message = `Invalid value or api url`;
    return new AppError(400, message);
};

// when user transaction and rollback
// export function handleDuplicateKeyErrorInTrsAndRb(error: any) {
//     const duplicateKeyErrorPattern =
//         /E11000 duplicate key error collection: (.+?) index: (.+?) dup key: \{ (.+?): "(.+?)" \}/;

//     const match = error.message.match(duplicateKeyErrorPattern);

//     if (match) {
//         const field = match[3];

//         const errorSourceObj = [
//             {
//                 path: field,
//                 message: `${field} is already exist`,
//             },
//         ];

//         return new AppError(
//             400,
//             `This ${field} is already exists.`,
//             errorSourceObj,
//         );
//     }

//     new AppError(400, 'An error occured');
// }

// export function handleValidationErrorTrsAndRb(error: any) {
//     const validationErrorPattern = /ValidationError: (.+)/;
//     const errorMessages = error.message.split(', ');

//     const errorSourceObjArr = errorMessages
//         .map((errorMessage: any) => {
//             const match = errorMessage.match(validationErrorPattern);
//             if (match) {
//                 const fieldsAndMessages = match[1]
//                     .split(', ')
//                     .map((fieldAndMessage: any) => {
//                         const [field, message] = fieldAndMessage.split(': ');
//                         return {
//                             path: field.trim(),
//                             message: message.trim(),
//                         };
//                     });
//                 return fieldsAndMessages;
//             }
//             // Handle cases where the error message format doesn't match expected pattern
//             return [
//                 {
//                     path: 'unknown',
//                     message: 'Unknown validation error',
//                 },
//             ];
//         })
//         .flat(); // Flatten the array of arrays into a single array

//     return new AppError(400, 'Validation Error', errorSourceObjArr);
// }

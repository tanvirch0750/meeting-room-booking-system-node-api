import { Model } from 'mongoose';

export type ICq = {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    isAnswered?: boolean;
    isDeleted: boolean;
};

export type ICqMethods = {
    anyInstanceMethod(): Promise<string>;
};

export interface ICqModel
    extends Model<ICq, Record<string, never>, ICqMethods> {
    anyStaticMethods(): Promise<ICq>;
}

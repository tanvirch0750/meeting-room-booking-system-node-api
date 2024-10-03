import { Model, Types } from 'mongoose';

export type IBooking = {
    date: string;
    room?: Types.ObjectId;
    user?: Types.ObjectId;
    slots: Types.ObjectId[];
    totalAmount?: number;
    isConfirmed?: 'confirmed' | 'unconfirmed' | 'cancelled';
    isDeleted: boolean;
    trxId: string;
    reviewId?: string;
    isReviewAdded?: boolean;
};

// Define the type for custom instance methods
export type IBookingMethods = {
    // Example of an instance method returning a promise with a string
    anyInstanceMethod(): Promise<string>;
};

// Define the type for the user model, including both instance and static methods
export interface IBookingModel
    extends Model<IBooking, Record<string, never>, IBookingMethods> {
    //static methods for checking if the user exist
    anyStaticMethods(): Promise<IBooking>;
}

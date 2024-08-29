import { Model, Types } from 'mongoose';

export type IReview = {
    review: string;
    user: Types.ObjectId;
    room: Types.ObjectId;
    rating?: number;
    isDeleted: boolean;
};

// Define the type for custom instance methods
export type IReviewMethods = {
    // Example of an instance method returning a promise with a string
    anyInstanceMethod(): Promise<string>;
};

// Define the type for the user model, including both instance and static methods
export interface IReviewModel
    extends Model<IReview, Record<string, never>, IReviewMethods> {
    //static methods for checking if the user exist
    anyStaticMethods(): Promise<IReview>;
}

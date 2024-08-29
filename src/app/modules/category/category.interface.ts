import { Model } from 'mongoose';

export type ICategory = {
    name: string;
    isDeleted: boolean;
};

// Define the type for custom instance methods
export type ICategoryMethods = {
    // Example of an instance method returning a promise with a string
    anyInstanceMethod(): Promise<string>;
};

// Define the type for the user model, including both instance and static methods
export interface ICategoryModel
    extends Model<ICategory, Record<string, never>, ICategoryMethods> {
    //static methods for checking if the user exist
    anyStaticMethods(): Promise<ICategory>;
}

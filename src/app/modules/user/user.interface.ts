import { Model } from 'mongoose';

export type IRole = 'admin' | 'user';

export type IUser = {
    [x: string]: unknown;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: IRole;
    isDeleted: boolean;
    image: string;
    createdAt?: string;
    updatedAt?: string;
    bio?: string;
    socialMedia?: Record<string, string>;
    __v?: string;
};

// Define the type for custom instance methods
export type IUserMethods = {
    // Example of an instance method returning a promise with a string
    anyInstanceMethod(): Promise<string>;
};

// Define the type for the user model, including both instance and static methods
export interface IUserModel
    extends Model<IUser, Record<string, never>, IUserMethods> {
    //static methods for checking if the user exist
    isUserExistsByEmail(email: string): Promise<IUser>;
    //static methods for checking if passwords are matched
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>;
}

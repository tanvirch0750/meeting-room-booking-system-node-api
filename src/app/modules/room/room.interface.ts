import { Model, Types } from 'mongoose';

export type IRoom = {
    name: string;
    roomNo: number;
    floorNo: number;
    capacity: number;
    pricePerSlot: number;
    amenities: string[];
    isDeleted: boolean;
    images: string[];
    category: Types.ObjectId;
    isFeatured: boolean;
    description: string;
    _id?: string;
};

// Define the type for custom instance methods
export type IRoomMethods = {
    // Example of an instance method returning a promise with a string
    anyInstanceMethod(): Promise<string>;
};

// Define the type for the user model, including both instance and static methods
export interface IRoomModel
    extends Model<IRoom, Record<string, never>, IRoomMethods> {
    //static methods for checking if the user exist
    anyStaticMethods(): Promise<IRoom>;
}

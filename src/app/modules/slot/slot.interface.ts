import { Model, Types } from 'mongoose';

export type ISlot = {
    room: Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    isDeleted: boolean;
    roomName?: string;
};

// Define the type for custom instance methods
export type ISlotMethods = {
    // Example of an instance method returning a promise with a string
    anyInstanceMethod(): Promise<string>;
};

// Define the type for the user model, including both instance and static methods
export interface ISlotModel
    extends Model<ISlot, Record<string, never>, ISlotMethods> {
    //static methods for checking if the user exist
    anyStaticMethods(): Promise<ISlot>;
}

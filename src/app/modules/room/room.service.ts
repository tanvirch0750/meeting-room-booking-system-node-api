import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { RoomSearchableFields } from './room.constant';
import { IRoom } from './room.interface';
import { Room } from './room.model';

const createRoomIntoDB = async (payload: IRoom) => {
    const result = await Room.create(payload);
    return result;
};

const getAllRoomsFromDB = async (query: Record<string, unknown>) => {
    const roomQuery = new QueryBuilder(Room.find().populate('category'), query)
        .search(RoomSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await roomQuery.modelQuery;
    return result;
};

const getSingleRoomFromDB = async (id: string) => {
    const result = await Room.findById(id).populate('category');

    if (!result) throw new AppError(404, `No room found with (${id}) this id`);

    return result;
};

const updateRoomIntoDB = async (id: string, payload: Partial<IRoom>) => {
    // Check if the booking exists
    const roomExists = await Room.findById(id);
    if (!roomExists) {
        throw new AppError(404, `Room not found with ID: ${id}`);
    }

    const result = await Room.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};

const deleteRoomFromDB = async (id: string) => {
    // Check if the booking exists
    const roomExists = await Room.findById(id);
    if (!roomExists) {
        throw new AppError(404, `Room not found with ID: ${id}`);
    }

    const result = await Room.updateOne({ _id: id }, { isDeleted: true });

    return result;
};

export const roomServices = {
    createRoomIntoDB,
    getAllRoomsFromDB,
    getSingleRoomFromDB,
    updateRoomIntoDB,
    deleteRoomFromDB,
};

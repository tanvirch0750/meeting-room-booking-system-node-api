import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { Review } from '../reviews/reviews.model';
import { RoomSearchableFields } from './room.constant';
import { IRoom } from './room.interface';
import { Room } from './room.model';

const createRoomIntoDB = async (payload: IRoom) => {
    const result = await Room.create(payload);
    return result;
};

const getAllRoomsFromDB = async (query: Record<string, unknown>) => {
    // Step 1: Query for rooms
    const roomQuery = new QueryBuilder(Room.find().populate('category'), query)
        .search(RoomSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const rooms = await roomQuery.modelQuery;

    // Step 2: Add averageRating to each room
    const roomIds = rooms.map((room) => room._id);

    // Aggregate reviews to calculate average rating for each room
    const ratings = await Review.aggregate([
        {
            $match: {
                room: { $in: roomIds }, // Match reviews for the current rooms
                isDeleted: false, // Exclude deleted reviews
            },
        },
        {
            $group: {
                _id: '$room',
                averageRating: { $avg: '$rating' }, // Calculate the average rating
                totalReviews: { $sum: 1 }, // Count the number of reviews (optional)
            },
        },
    ]);

    // Step 3: Map ratings back to the rooms
    const roomsWithRating = rooms.map((room) => {
        const rating = ratings.find((r) => r._id.equals(room._id));
        return {
            // @ts-ignore
            ...room.toObject(),
            averageRating: rating ? rating.averageRating : 0,
            totalReviews: rating ? rating.totalReviews : 0,
        };
    });

    return roomsWithRating;
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

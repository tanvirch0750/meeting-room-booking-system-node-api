import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/appError';
import { IUser } from './user.interface';
import { User } from './user.model';

const getAllUsersFromDB = async () => {
    const result = await User.find();

    return result;
};

const getUserById = async (id: string) => {
    const result = await User.findById(id);

    if (!result) throw new AppError(404, `No User found with (${id}) this id`);

    return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<IUser>) => {
    const userExists = await User.findById(id);
    if (!userExists) {
        throw new AppError(404, `Review not found with ID: ${id}`);
    }

    const result = await User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};

const getProfileData = async (verifiedUser: JwtPayload) => {
    console.log(verifiedUser);
    const result = await User.findOne({ email: verifiedUser.userEmail });

    if (!result) {
        throw new AppError(404, 'No user found with this id');
    }

    return result;
};

export const userServices = {
    getAllUsersFromDB,
    getUserById,
    getProfileData,
    updateUserIntoDB,
};

import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { CqSearchableFields } from './cq.constant';
import { ICq } from './cq.interface';
import { Cq } from './cq.model';

const createCqIntoDB = async (payload: ICq) => {
    const result = await Cq.create(payload);
    return result;
};

const getAllCqsFromDB = async (query: Record<string, unknown>) => {
    const cqQuery = new QueryBuilder(Cq.find(), query)
        .search(CqSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await cqQuery.modelQuery;
    return result;
};

const getSingleCqFromDB = async (id: string) => {
    const result = await Cq.findById(id);

    if (!result)
        throw new AppError(404, `No Customer Query found with (${id}) this id`);

    return result;
};

const updateCqIntoDB = async (id: string, payload: Partial<ICq>) => {
    // Check if the booking exists
    const cqExists = await Cq.findById(id);
    if (!cqExists) {
        throw new AppError(404, `Customer Query not found with ID: ${id}`);
    }

    const result = await Cq.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};

const deleteCqFromDB = async (id: string) => {
    // Check if the booking exists
    const cqExists = await Cq.findById(id);
    if (!cqExists) {
        throw new AppError(404, `Customer Query not found with ID: ${id}`);
    }

    const result = await Cq.updateOne({ _id: id }, { isDeleted: true });

    return result;
};

export const cqServices = {
    createCqIntoDB,
    getAllCqsFromDB,
    getSingleCqFromDB,
    updateCqIntoDB,
    deleteCqFromDB,
};

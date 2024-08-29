import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { CategorySearchableFields } from './category.constant';
import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDB = async (payload: ICategory) => {
    const result = await Category.create(payload);
    return result;
};

const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
    const categoryQuery = new QueryBuilder(Category.find(), query)
        .search(CategorySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await categoryQuery.modelQuery;
    return result;
};

const getSingleCategoryFromDB = async (id: string) => {
    const result = await Category.findById(id);

    if (!result)
        throw new AppError(404, `No Category found with (${id}) this id`);

    return result;
};

const updateCategoryIntoDB = async (
    id: string,
    payload: Partial<ICategory>,
) => {
    // Check if the booking exists
    const categoryExists = await Category.findById(id);
    if (!categoryExists) {
        throw new AppError(404, `Category not found with ID: ${id}`);
    }

    const result = await Category.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};

const deleteCategoryFromDB = async (id: string) => {
    // Check if the booking exists
    const categoryExists = await Category.findById(id);
    if (!categoryExists) {
        throw new AppError(404, `Category not found with ID: ${id}`);
    }

    const result = await Category.updateOne({ _id: id }, { isDeleted: true });

    return result;
};

export const categoryServices = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getSingleCategoryFromDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB,
};

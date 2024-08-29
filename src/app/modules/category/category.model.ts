import { Schema, model } from 'mongoose';
import {
    ICategory,
    ICategoryMethods,
    ICategoryModel,
} from './category.interface';

const categorySchema = new Schema<ICategory, ICategoryModel, ICategoryMethods>(
    {
        name: { type: String, required: true, unique: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

// filter out deleted documents
categorySchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

categorySchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

categorySchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const Category = model<ICategory, ICategoryModel>(
    'Category',
    categorySchema,
);

import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;
    public aggregationPipeline: any[];
    private useAggregation: boolean;

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
        this.aggregationPipeline = [];
        this.useAggregation = false;
    }

    search(searchableFields: string[]) {
        const searchTerm = this?.query?.searchTerm;
        if (searchTerm) {
            const searchConditions = {
                $or: searchableFields.map(
                    (field) =>
                        ({
                            [field]: { $regex: searchTerm, $options: 'i' },
                        }) as FilterQuery<T>,
                ),
            };
            this.modelQuery = this.modelQuery.find(searchConditions);
            this.aggregationPipeline.push({ $match: searchConditions });
        }

        return this;
    }

    filter() {
        const queryObj = { ...this.query }; // copy

        // Filtering
        const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

        excludeFields.forEach((el) => delete queryObj[el]);

        this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
        this.aggregationPipeline.push({ $match: queryObj });

        return this;
    }

    sort() {
        const sort =
            (this?.query?.sort as string)?.split(',')?.join(' ') ||
            '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort as string);
        this.aggregationPipeline.push({ $sort: sort });

        return this;
    }

    paginate() {
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        this.aggregationPipeline.push({ $skip: skip }, { $limit: limit });

        return this;
    }

    fields() {
        const fields =
            (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
        const projectFields = fields.split(' ').reduce((acc: any, field) => {
            acc[field] = 1;
            return acc;
        }, {});

        this.modelQuery = this.modelQuery.select(fields);
        this.aggregationPipeline.push({ $project: projectFields });

        return this;
    }

    aggregate(stages: any[]) {
        this.useAggregation = true;
        this.aggregationPipeline.push(...stages);
        return this;
    }

    async execute() {
        if (this.useAggregation) {
            return this.modelQuery.model.aggregate(this.aggregationPipeline);
        } else {
            return this.modelQuery;
        }
    }
}

export default QueryBuilder;

import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { userRoles } from './user.constant';
import { IUser, IUserMethods, IUserModel } from './user.interface';

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
        },
        password: {
            type: String,
            select: 0,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        company: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: userRoles,
            default: 'user',
        },

        bio: {
            required: false,
            type: String,
        },
        socialMedia: {
            required: false,
            type: Object,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// pre document middleware / hook: will work on create() and save() function - to hash pass
userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;

    // Only hash the password if it is provided
    if (user.isModified('password') && user.password) {
        user.password = await bcrypt.hash(
            // @ts-ignore
            user.password,
            Number(config.bcrypt_salt_rounds),
        );
    }

    next();
});

// post document middleware / hook - show emapty string after creating the user
userSchema.post('save', function (doc, next) {
    doc.password = '';

    next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
    return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, IUserModel>('User', userSchema);

import { IRole } from './user.interface';

export const userRoles: IRole[] = ['admin', 'admin'];

export const USER_ROLE = {
    user: 'user',
    admin: 'admin',
} as const;

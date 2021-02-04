import { get } from '../api';

export const getUser = <T = any>() => get<T>('user');

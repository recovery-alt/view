import { get, del, put, post } from './api';

const prefix = 'user';

export const addUser = <T = any>() => post<T>(prefix);

export const deleteUser = <T = any>() => del<T>(prefix);

export const updateUser = <T = any>() => put<T>(prefix);

export const getUser = <T = any>() => get<T>(prefix);

export const changePassword = <T = any>(params: Data) =>
  post<T>(`${prefix}/changePassword`, params);

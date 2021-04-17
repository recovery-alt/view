import { get, del, put, post } from './api';

const prefix = 'page';

export const addPage = <T = any>(params: Data) => post<T>(prefix, params);

export const deletePage = <T = any>(id: string) => del<T>(`${prefix}/${id}`);

export const updatePage = <T = any>(params: Data) => put<T>(prefix, params);

export const getPage = <T = any>(id: string) => get<T>(`${prefix}/${id}`);

export const getPages = <T = any>() => get<T>(prefix);

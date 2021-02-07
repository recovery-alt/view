import { get, del, put, post } from './api';

const prefix = 'board';

export const addBoard = <T = any>() => post<T>(prefix);

export const deleteBoard = <T = any>() => del<T>(prefix);

export const updateBoard = <T = any>() => put<T>(prefix);

export const getBoard = <T = any>() => get<T>(prefix);

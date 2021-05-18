import type { Data } from '@/typings';
import { get } from './api';

export * from './user';
export * from './page';

export const login = <T = any>(params: Data) => get<T>('login', params);

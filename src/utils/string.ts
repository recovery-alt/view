import { snakeCase, toUpper } from 'lodash';

export const camel2Snake = (input: string) => toUpper(snakeCase(input));

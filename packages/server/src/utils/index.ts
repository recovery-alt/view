import { readFileSync } from 'fs';
import { resolve } from 'path';
import { pki } from 'node-forge';
import { tips } from '@/config';
import { ResponseEnum } from '@/enum';

export const wrapResponse = (data: unknown, code = 0) => ({ data, code, msg: 'success' });

export const wrapError = (code: ResponseEnum) => ({ msg: tips[code], code });

// 包裹async/await错误处理
export const to = <T>(promise: Promise<T>) =>
  promise.then(data => [null, data]).catch(err => [err]);

export const decrypt: <T extends string | string[]>(input: T) => T = input => {
  const privateKey = readFileSync(resolve(__dirname, '../key/rsa-private-key.pem'), 'utf8');

  const privateK = pki.privateKeyFromPem(privateKey);
  const decryptInput = (str: string) => {
    const encrypted = Buffer.from(str, 'base64').toString();
    const decrypted = privateK.decrypt(encrypted, 'RSA-OAEP');
    return decodeURIComponent(decrypted);
  };
  const result = Array.isArray(input) ? input.map(decryptInput) : decryptInput(input as string);
  return result as typeof input;
};

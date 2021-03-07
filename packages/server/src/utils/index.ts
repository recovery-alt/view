import { readFileSync } from 'fs';
import { resolve } from 'path';
import { pki } from 'node-forge';
import { tips } from '@/config';
import { ResponseEnum } from '@/enum';

export const wrapResponse = (data: unknown, code = 0) => ({ data, code });

export const wrapError = (code: ResponseEnum) => ({ data: tips[code], code });

// 包裹async/await错误处理
export const to = <T>(promise: Promise<T>) =>
  promise.then(data => [null, data]).catch(err => [err]);

export const decrypt = (input: string) => {
  const privateKey = readFileSync(resolve(__dirname, '../key/rsa-private-key.pem'), 'utf8');

  const privateK = pki.privateKeyFromPem(privateKey);
  const encrypted = Buffer.from(input, 'base64').toString();
  const decrypted = privateK.decrypt(encrypted, 'RSA-OAEP');
  return decodeURIComponent(decrypted);
};

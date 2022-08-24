import { pki } from 'node-forge';
import { tips } from '@/config';
import { ResponseEnum } from '@/enum';
import { networkInterfaces } from 'os';
import { privateKey } from '../key';

export const wrapResponse = (data: unknown, code = 0) => ({ data, code, msg: 'success' });

export const wrapError = (code: ResponseEnum) => ({ msg: tips[code], code });

// 包裹async/await错误处理
export const to = <T>(promise: Promise<T>) =>
  promise.then(data => [null, data]).catch(err => [err]);

export const decrypt: <T extends string | string[]>(input: T) => T = input => {
  const privateK = pki.privateKeyFromPem(privateKey);
  const decryptInput = (str: string) => {
    const encrypted = Buffer.from(str, 'base64').toString();
    const decrypted = privateK.decrypt(encrypted, 'RSA-OAEP');
    return decodeURIComponent(decrypted);
  };
  const result = Array.isArray(input) ? input.map(decryptInput) : decryptInput(input as string);
  return result as typeof input;
};

export const getIPAdress = () => {
  const interfaces = networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    if (!iface) continue;
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
};

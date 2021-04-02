import axios, { AxiosResponse } from 'axios';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';
import json from 'json5';

// 默认提示
const TIP = '连接出错了~';

// 接口请求报错的时候，伪装成正常错误，由业务代码处理
const apiErrorHandler = (message?: unknown) => {
  const msg = typeof message === 'string' ? message : TIP;
  // 错误抛到业务代码
  return Promise.resolve({ code: -10000, msg });
};

const baseURL = 'http://localhost:3000/api/v1/';

// 策略模式生产状态码
const statusStrategy = (status: number) => {
  const statusEnum: Record<number, string> = {
    400: '请求错误(400)',
    401: '未授权，请重新登录(401)',
    403: '拒绝访问(403)',
    404: '请求出错(404)',
    408: '请求超时(408)',
    500: '服务器错误(500)',
    501: '服务未实现(501)',
    502: '网络错误(502)',
    503: '服务不可用(503)',
    504: '网络超时(504)',
    505: 'HTTP版本不受支持(505)',
    0: `连接出错(${status})!`,
  };
  const message = statusEnum[status] || statusEnum[0];
  return `${message}，请检查网络或联系管理员！`;
};

const service = axios.create({
  // 联调
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [
    (data: unknown) => {
      if (typeof data === 'string' && data.startsWith('{')) {
        data = json.parse(data);
      }
      return data;
    },
  ],
});

// 请求拦截器
service.interceptors.request.use(config => {
  const authorization = local.get(LocalKeys.AUTHORIZATION);
  if (authorization) {
    config.headers.authorization = authorization;
  }
  return config;
}, apiErrorHandler);

// 响应拦截器
service.interceptors.response.use(async (response: AxiosResponse) => {
  const status = response.status;
  if (status < 200 || status >= 300) {
    // 处理http错误
    return apiErrorHandler(statusStrategy(status));
  }
  return response.data;
}, apiErrorHandler);

// get请求
const get = <T>(url: string, params?: Data, config?: Data) =>
  service.get<T, ResponseData<T>>(url, { ...config, params });

// post请求
const post = <T>(url: string, params?: Data | string[], config?: Data) =>
  service.post<T, ResponseData<T>>(url, params, config);

// put请求
const put = <T>(url: string, params?: Data, config?: Data) =>
  service.put<T, ResponseData<T>>(url, params, config);

// delete请求
const del = <T>(url: string, params?: Data, config?: Data) =>
  service.delete<T, ResponseData<T>>(url, { ...config, params });

export { get, post, put, del };

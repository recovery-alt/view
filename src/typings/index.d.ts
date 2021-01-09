type ResponseData<T = any> = {
  code: number;
  data: T;
  msg: string;
};

type Data<T = unknown> = Record<string, T>;

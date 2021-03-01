// 封装localStorage，可设置过期事件
export const local = {
  set(key: string, value: unknown, expires = 86400000) {
    const handledValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, handledValue);
    localStorage.setItem(`${key}__expires__`, Date.now() + expires + '');
    return value;
  },
  get(key: string) {
    const now = Date.now();
    const expired = localStorage.getItem(`${key}__expires__`) || now + 1;
    if (now >= expired) {
      this.remove(key);
      return;
    }
    return localStorage.getItem(key);
  },
  remove(key: string) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}__expires__`);
  },
};

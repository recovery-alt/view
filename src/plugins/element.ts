import { App } from 'vue';
import { ElButton, ElInput } from 'element-plus';

export const useElement = (app: App) => {
  app.use(ElButton);
  app.use(ElInput);
};

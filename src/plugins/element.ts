import { App } from 'vue';
import { ElButton } from 'element-plus';

export const useElement = (app: App) => {
  app.use(ElButton);
};

import { App } from 'vue';
import { ElButton, ElInput, ElTabs, ElTabPane } from 'element-plus';

export const useElement = (app: App) => {
  app.use(ElButton);
  app.use(ElInput);
  app.use(ElTabs);
  app.use(ElTabPane);
};

import { App } from 'vue';
import {
  ElButton,
  ElInput,
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElColorPicker,
} from 'element-plus';

export const useElement = (app: App) => {
  app.use(ElButton);
  app.use(ElInput);
  app.use(ElTabs);
  app.use(ElTabPane);
  app.use(ElForm);
  app.use(ElFormItem);
  app.use(ElInputNumber);
  app.use(ElColorPicker);
};

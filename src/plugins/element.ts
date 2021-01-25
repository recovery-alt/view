import { App } from 'vue';
import lang from 'element-plus/lib/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/lib/locale';
import {
  ElButton,
  ElInput,
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElColorPicker,
  ElTree,
  ElSelect,
  ElOption,
  ElButtonGroup,
  ElDrawer,
  ElCollapse,
  ElCollapseItem,
} from 'element-plus';

export const useElement = (app: App) => {
  locale.use(lang);
  app.use(ElButton);
  app.use(ElInput);
  app.use(ElTabs);
  app.use(ElTabPane);
  app.use(ElForm);
  app.use(ElFormItem);
  app.use(ElInputNumber);
  app.use(ElColorPicker);
  app.use(ElTree);
  app.use(ElSelect);
  app.use(ElOption as any);
  app.use(ElButtonGroup);
  app.use(ElDrawer);
  app.use(ElCollapse);
  app.use(ElCollapseItem);
};

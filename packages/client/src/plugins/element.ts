import { App } from 'vue';
import lang from 'element-plus/lib/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/lib/locale';
import 'element-plus/lib/theme-chalk/el-button.css';
import 'element-plus/lib/theme-chalk/el-input.css';
import 'element-plus/lib/theme-chalk/el-tabs.css';
import 'element-plus/lib/theme-chalk/el-tab-pane.css';
import 'element-plus/lib/theme-chalk/el-form.css';
import 'element-plus/lib/theme-chalk/el-form-item.css';
import 'element-plus/lib/theme-chalk/el-input-number.css';
import 'element-plus/lib/theme-chalk/el-color-picker.css';
import 'element-plus/lib/theme-chalk/el-select.css';
import 'element-plus/lib/theme-chalk/el-option.css';
import 'element-plus/lib/theme-chalk/el-button-group.css';
import 'element-plus/lib/theme-chalk/el-drawer.css';
import 'element-plus/lib/theme-chalk/el-collapse.css';
import 'element-plus/lib/theme-chalk/el-collapse-item.css';
import 'element-plus/lib/theme-chalk/el-tooltip.css';
import 'element-plus/lib/theme-chalk/el-empty.css';
import 'element-plus/lib/theme-chalk/el-icon.css';
import 'element-plus/lib/theme-chalk/el-message.css';

import {
  ElButton,
  ElInput,
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElColorPicker,
  ElSelect,
  ElOption,
  ElButtonGroup,
  ElDrawer,
  ElCollapse,
  ElCollapseItem,
  ElTooltip,
  ElEmpty,
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
  app.use(ElSelect);
  app.use(ElOption as any);
  app.use(ElButtonGroup);
  app.use(ElDrawer);
  app.use(ElCollapse);
  app.use(ElCollapseItem);
  app.use(ElTooltip as any);
  app.use(ElEmpty);
};

import { App } from 'vue';
import 'ant-design-vue/lib/style/index.css';
import 'ant-design-vue/lib/grid/style/index.css';
import 'ant-design-vue/lib/button/style/index.css';
import 'ant-design-vue/lib/input/style/index.css';
import 'ant-design-vue/lib/tabs/style/index.css';
import 'ant-design-vue/lib/form/style/index.css';
import 'ant-design-vue/lib/input-number/style/index.css';
import 'ant-design-vue/lib/select/style/index.css';
import 'ant-design-vue/lib/drawer/style/index.css';
import 'ant-design-vue/lib/collapse/style/index.css';
import 'ant-design-vue/lib/tooltip/style/index.css';
import 'ant-design-vue/lib/empty/style/index.css';
import 'ant-design-vue/lib/config-provider/style/index.css';
import {
  Button,
  Input,
  Tabs,
  Form,
  InputNumber,
  Select,
  Drawer,
  Collapse,
  Tooltip,
  Empty,
  ConfigProvider,
} from 'ant-design-vue';

export const useAntDesign = (app: App) => {
  app.use(Button);
  app.use(Input);
  app.use(Tabs);
  app.use(Form);
  app.use(InputNumber);
  app.use(Select);
  app.use(Drawer);
  app.use(Collapse);
  app.use(Tooltip);
  app.use(Empty);
  app.use(ConfigProvider);
};

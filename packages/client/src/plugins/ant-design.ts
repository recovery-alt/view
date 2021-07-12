import { App } from 'vue';
import 'ant-design-vue/lib/style/index.css';
import 'ant-design-vue/lib/grid/style/index.css';
import 'ant-design-vue/lib/message/style/index.css';
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
import 'ant-design-vue/lib/layout/style/index.css';
import 'ant-design-vue/lib/menu/style/index.css';
import 'ant-design-vue/lib/table/style/index.css';
import 'ant-design-vue/lib/pagination/style/index.css';
import 'ant-design-vue/lib/divider/style/index.css';
import 'ant-design-vue/lib/avatar/style/index.css';
import 'ant-design-vue/lib/dropdown/style/index.css';
import 'ant-design-vue/lib/popover/style/index.css';
import 'ant-design-vue/lib/modal/style/index.css';
import 'ant-design-vue/lib/checkbox/style/index.css';
import 'ant-design-vue/lib/slider/style/index.css';
import 'ant-design-vue/lib/carousel/style/index.css';
import 'ant-design-vue/lib/timeline/style/index.css';
import 'ant-design-vue/lib/switch/style/index.css';
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
  Layout,
  Menu,
  Table,
  Pagination,
  Divider,
  Avatar,
  Dropdown,
  Popover,
  Modal,
  Checkbox,
  Slider,
  Col,
  Row,
  Carousel,
  Timeline,
  Switch,
} from 'ant-design-vue';

export const useAntDesign = (app: App<Element>) => {
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
  app.use(Layout);
  app.use(Menu);
  app.use(Table);
  app.use(Pagination);
  app.use(Divider);
  app.use(Avatar);
  app.use(Dropdown);
  app.use(Popover);
  app.use(Modal);
  app.use(Checkbox);
  app.use(Slider);
  app.use(Col);
  app.use(Row);
  app.use(Carousel);
  app.use(Timeline);
  app.use(Switch);
};

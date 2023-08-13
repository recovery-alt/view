import type { Data, Gallery } from '@/typings';
import { LineChartOutlined } from '@ant-design/icons-vue';

type Module = { [key: string]: Gallery };

const components: Data<() => Promise<Module>> = {};

const modules = import.meta.glob<Module>('./*/index.ts');

for (const [key, module] of Object.entries(modules)) {
  const matcher = key.match(/\.\/(.*)\/index\.ts/);
  if (matcher?.[1]) {
    components[matcher[1]] = module;
  }
}

export default {
  components,
  name: 'chart',
  order: 1,
  dataConfig: true,
  icon: LineChartOutlined,
};

import type { Data, Gallery } from '@/typings';
import { BankOutlined } from '@ant-design/icons-vue';

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
  name: 'basic',
  order: 0,
  icon: BankOutlined,
};

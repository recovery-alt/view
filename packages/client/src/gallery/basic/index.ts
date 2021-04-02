import { BankOutlined } from '@ant-design/icons-vue';

const components: Data<() => Promise<{ [key: string]: Gallery }>> = {};

const modules = import.meta.glob('./*/index.ts');

for (const [key, module] of Object.entries(modules)) {
  const matcher = key.match(/\.\/(.*)\/index\.ts/);
  if (matcher && matcher[1]) {
    components[matcher[1]] = module;
  }
}

export default {
  components,
  name: '基础',
  order: 0,
  icon: BankOutlined,
};

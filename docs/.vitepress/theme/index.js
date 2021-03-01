import DefaultTheme from 'vitepress/theme';
import CqDemo from '../components/cq-demo.vue';

export default {
  NotFound: () => 'custom 404', // <- this is a Vue 3 functional component
  enhanceApp({ app, router, siteData }) {
    app.component('cq-demo', CqDemo);
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
  },
  ...DefaultTheme,
};

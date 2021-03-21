import { createApp } from 'vue';
import App from '@/app.vue';
import router from '@/router';
import { store, key } from '@/store';
import { useAntDesign } from '@/plugins';
import useGallery from '@/gallery';
import 'normalize.css';
import 'animate.css';
import '@/assets/style/index.less';

const app = createApp(App);
useAntDesign(app);
useGallery(app);

app.use(store, key).use(router).mount('#app');

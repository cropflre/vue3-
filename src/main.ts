import { createApp } from 'vue';
import App from './App.vue';
import locale from 'element-plus/lib/locale/lang/zh-cn'; // 中文编码
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/display.css';
import { createPinia } from 'pinia';
import router from './router/index';
import './mock/index';
const app = createApp(App);
import axios from './utils/http/index';
app.use(router);
app.use(ElementPlus, { locale, size: 'small' });
app.use(createPinia());
app.mount('#app');
app.config.globalProperties.$axios = axios;

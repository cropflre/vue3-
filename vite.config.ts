import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';
import { resolve } from 'path';
function pathResolve(dir: string) {
  return resolve(__dirname, dir);
}
export default defineConfig({
  resolve: {
    alias: {
      '@': pathResolve('src'),
    },
  },
  plugins: [
    vue(),
    // viteMockServe({
    //   //配置mock位置
    //   mockPath: '/src/mock',
    // }),
  ],
});

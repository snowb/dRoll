import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const datetime = new Date();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/dRoll",
  optimizeDeps: {
    exclude: ['oh-vue-icons/icons'],
  },
  define: {
    __BUILD_DATETIME__: JSON.stringify(datetime.getTime())
  }
});


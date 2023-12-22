import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';

// 路由守卫
import './permission'

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app').$nextTick(() => {
  // Remove Preload scripts loading
  postMessage({ payload: 'removeLoading' }, '*')

  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})

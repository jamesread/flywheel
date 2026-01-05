import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import './style.css'
import App from './App.vue'

const updateSW = registerSW({
  onNeedRefresh() {
    // Optional: Show a notification that an update is available
    console.log('New content available, please refresh.')
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

// Store SW update function globally for App component access
if (typeof window !== 'undefined') {
  window.__SW_UPDATE__ = updateSW
}

createApp(App).mount('#app')

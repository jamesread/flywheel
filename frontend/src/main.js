import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'

// Light Femtocrank tokens plus PicoCrank's data-theme aware dark theme. Do not
// import femtocrank/dark.css — it applies dark variables with
// prefers-color-scheme and ignores the theme toggle.
import 'femtocrank/style.css'
import 'picocrank/styles/picocrank-extensions.css'
import 'picocrank/styles/dark-theme.css'
import 'picocrank/vue/composables/useTheme.js'
import './style.css'
import App from './App.vue'
import { markUpdateAvailable } from './composables/useInit.js'

const updateSW = registerSW({
  onNeedRefresh() {
    // Surface the update in the footer's "new version available" row
    markUpdateAvailable()
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

import { reactive, readonly } from 'vue'

/**
 * Flywheel has no backend, so there is no Init RPC. This composable is the
 * local stand-in: it holds an InitResponse-shaped object (footer fields per
 * jwr-soa-ui-footer) so the UI only ever renders from "Init" state, and a
 * backend can replace it later without touching the components.
 */

function readCacheVersion() {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const swUrl = navigator.serviceWorker.controller.scriptURL
    // Extract version hash from SW URL if available (format: sw.js?v=hash)
    const match = swUrl.match(/[?&]v=([^&]+)/)
    if (match) {
      return match[1].substring(0, 8)
    }
    const urlHash = swUrl.split('/').pop().replace(/[^a-z0-9]/gi, '').substring(0, 8)
    if (urlHash) {
      return urlHash
    }
  }

  try {
    const storedVersion = localStorage.getItem('flywheel_cache_version')
    if (storedVersion) {
      return storedVersion.substring(0, 8)
    }

    // Generate a version based on current time (for development/initial load)
    const version = Date.now().toString(36)
    localStorage.setItem('flywheel_cache_version', version)
    return version.substring(0, 8)
  } catch {
    return ''
  }
}

const state = reactive({
  showFooter: true,
  showVersionNumber: true,
  showNewVersions: true,
  // @ts-ignore - Injected by Vite
  currentVersion: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '',
  cacheVersion: '',
  availableVersion: '',
  pageTitle: 'Flywheel',
})

let initialised = false

/** Re-read runtime fields (e.g. after a service worker controller change). */
export function reloadInit() {
  state.cacheVersion = readCacheVersion()
}

/** Called by the service worker registration when a newer build is waiting. */
export function markUpdateAvailable(label = 'New version available — reload') {
  state.availableVersion = label
}

export function useInit() {
  if (!initialised) {
    initialised = true
    reloadInit()

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', reloadInit)
    }
  }

  // Policy: when the version number is hidden, never expose version fields.
  if (!state.showVersionNumber) {
    state.currentVersion = ''
    state.cacheVersion = ''
    state.availableVersion = ''
    state.showNewVersions = false
  }

  return readonly(state)
}

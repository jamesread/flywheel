import { ref } from 'vue'

export function useInstallPrompt() {
  const deferredPrompt = ref(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)

  // Check if app is already installed
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt.value = e
      isInstallable.value = true
    })

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      isInstallable.value = false
      deferredPrompt.value = null
    })
  }

  async function promptInstall() {
    if (!deferredPrompt.value) {
      return false
    }

    // Show the install prompt
    deferredPrompt.value.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.value.userChoice

    // Clear the deferredPrompt
    deferredPrompt.value = null
    isInstallable.value = false

    return outcome === 'accepted'
  }

  return {
    isInstallable,
    isInstalled,
    promptInstall
  }
}

<template>
  <div class="app" :class="{ 'has-install-banner': isInstallable && !isInstalled && showInstallBanner }">
    <!-- Install Prompt Banner -->
    <div v-if="isInstallable && !isInstalled && showInstallBanner" class="install-banner">
      <div class="install-banner-content">
        <div class="install-banner-text">
          <strong>Install Flywheel</strong>
          <span>Add to your home screen for quick access</span>
        </div>
        <div class="install-banner-actions">
          <button @click="dismissInstall" class="install-dismiss-btn" aria-label="Dismiss">
            ×
          </button>
          <button @click="handleInstall" class="install-btn">
            Install
          </button>
        </div>
      </div>
    </div>

    <header class="header">
      <h1
        @click="toggleSwitcher"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        class="title-clickable"
      >
        Flywheel
      </h1>
      <p class="subtitle">Build habits, one day at a time</p>
    </header>

    <div v-if="showSwitcher" class="mode-toggle">
      <button
        :class="['mode-btn', { active: mode === 'check' }]"
        @click="mode = 'check'"
      >
        Check List
      </button>
      <button
        :class="['mode-btn', { active: mode === 'add' }]"
        @click="mode = 'add'"
      >
        Edit List
      </button>
    </div>

    <main class="main-content">
      <!-- Check List Mode (Default) -->
      <div v-if="mode === 'check'" class="check-list">
        <div v-if="habits.length === 0" class="empty-state">
          <p>No habits yet. Switch to "Edit List" to create your first habit!</p>
        </div>
        <div v-else>
          <div class="date-display">
            <p>{{ formattedDate }}</p>
          </div>
          <div class="habits-list">
            <label
              v-for="habit in habits"
              :key="habit.id"
              class="habit-item"
              :class="{ checked: isTicked(habit.id) }"
            >
              <input
                type="checkbox"
                :checked="isTicked(habit.id)"
                @change="toggleHabit(habit.id)"
                class="checkbox"
              />
              <span class="habit-name">{{ habit.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Edit List Mode -->
      <div v-if="mode === 'add'" class="add-list">
        <div class="add-form">
          <input
            v-model="newHabitName"
            @keyup.enter="addNewHabit"
            type="text"
            placeholder="Enter habit name (e.g., Brush Teeth)"
            class="habit-input"
          />
          <button @click="addNewHabit" class="add-btn" :disabled="!newHabitName.trim()">
            Add Habit
          </button>
        </div>
        <div v-if="habits.length > 0" class="habits-list">
          <div
            v-for="(habit, index) in habits"
            :key="habit.id"
            class="habit-item delete-mode"
            :class="{
              'dragging': draggedIndex === index,
              'drag-over': draggedOverIndex === index && draggedIndex !== index
            }"
            draggable="true"
            @dragstart="handleDragStart(index)"
            @dragover="handleDragOver($event, index)"
            @dragleave="handleDragLeave"
            @drop="handleDrop($event, index)"
            @dragend="handleDragEnd"
          >
            <span class="drag-handle" title="Drag to reorder">⋮⋮</span>
            <span class="habit-name">{{ habit.name }}</span>
            <button @click="deleteHabit(habit.id)" class="delete-btn" title="Delete habit">
              ×
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>Start building your habits! Add your first one above.</p>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p class="version-info">
        App v{{ appVersion }} | Cache v{{ cacheVersion }}
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getHabits,
  addHabit as addHabitToStorage,
  deleteHabit as deleteHabitFromStorage,
  reorderHabits,
  isTicked,
  toggleTick
} from './utils/storage.js'
import { useInstallPrompt } from './composables/useInstallPrompt.js'

const mode = ref('check') // 'check' or 'add'
const habits = ref([])
const newHabitName = ref('')

const formattedDate = ref('')
const showSwitcher = ref(false) // Hidden by default

// Version info
// @ts-ignore - Injected by Vite
const appVersion = ref(typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0')
const cacheVersion = ref('')

// Drag and drop state
const draggedIndex = ref(null)
const draggedOverIndex = ref(null)

// Install prompt functionality
const { isInstallable, isInstalled, promptInstall } = useInstallPrompt()
const showInstallBanner = ref(true)

function handleInstall() {
  promptInstall().then((accepted) => {
    if (accepted) {
      showInstallBanner.value = false
    }
  })
}

function dismissInstall() {
  showInstallBanner.value = false
  // Store dismissal in localStorage to not show again for this session
  localStorage.setItem('flywheel_install_dismissed', 'true')
}

function updateDate() {
  const today = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  formattedDate.value = today.toLocaleDateString('en-US', options)
}

function loadHabits() {
  habits.value = getHabits()
}

function addNewHabit() {
  const name = newHabitName.value.trim()
  if (name) {
    addHabitToStorage(name)
    newHabitName.value = ''
    loadHabits()
  }
}

function deleteHabit(habitId) {
  if (confirm('Are you sure you want to delete this habit?')) {
    deleteHabitFromStorage(habitId)
    loadHabits()
  }
}

function toggleHabit(habitId) {
  toggleTick(habitId)
  // Force reactivity update
  habits.value = [...habits.value]
}

function handleDragStart(index) {
  draggedIndex.value = index
}

function handleDragOver(e, index) {
  e.preventDefault()
  draggedOverIndex.value = index
}

function handleDragLeave() {
  draggedOverIndex.value = null
}

function handleDrop(e, dropIndex) {
  e.preventDefault()
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    draggedIndex.value = null
    draggedOverIndex.value = null
    return
  }

  const newHabits = [...habits.value]
  const [draggedHabit] = newHabits.splice(draggedIndex.value, 1)
  newHabits.splice(dropIndex, 0, draggedHabit)

  habits.value = newHabits
  reorderHabits(newHabits.map(h => h.id))

  draggedIndex.value = null
  draggedOverIndex.value = null
}

function handleDragEnd() {
  draggedIndex.value = null
  draggedOverIndex.value = null
}

function toggleSwitcher() {
  showSwitcher.value = !showSwitcher.value
}

// Touch event handlers for better mobile support
let touchStartTime = 0
let touchMoved = false
let touchStartY = 0

function handleTouchStart(e) {
  touchStartTime = Date.now()
  touchMoved = false
  touchStartY = e.touches[0].clientY
  // Add visual feedback
  e.currentTarget.classList.add('touching')
}

function handleTouchMove(e) {
  if (e.touches.length > 0) {
    const touchY = e.touches[0].clientY
    const deltaY = Math.abs(touchY - touchStartY)
    // If moved more than 10px, consider it a drag/swipe
    if (deltaY > 10) {
      touchMoved = true
      e.currentTarget.classList.remove('touching')
    }
  }
}

function handleTouchEnd(e) {
  const touchDuration = Date.now() - touchStartTime
  e.currentTarget.classList.remove('touching')

  // Only toggle if it was a quick tap (not a drag/swipe)
  if (!touchMoved && touchDuration < 300) {
    e.preventDefault()
    toggleSwitcher()
  }

  // Reset state
  touchMoved = false
}

function getCacheVersion() {
  // Try to get service worker version from URL
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const swUrl = navigator.serviceWorker.controller.scriptURL
    // Extract version hash from SW URL if available (format: sw.js?v=hash)
    const match = swUrl.match(/[?&]v=([^&]+)/)
    if (match) {
      return match[1].substring(0, 8)
    }
    // Fallback: use hash of the URL itself
    const urlHash = swUrl.split('/').pop().replace(/[^a-z0-9]/gi, '').substring(0, 8)
    if (urlHash) {
      return urlHash
    }
  }

  // Fallback: use stored version or generate one
  const storedVersion = localStorage.getItem('flywheel_cache_version')
  if (storedVersion) {
    return storedVersion.substring(0, 8)
  }

  // Generate a version based on current time (for development/initial load)
  const version = Date.now().toString(36)
  localStorage.setItem('flywheel_cache_version', version)
  return version.substring(0, 8)
}

onMounted(() => {
  updateDate()
  loadHabits()
  cacheVersion.value = getCacheVersion()

  // Update date every minute to keep it current
  setInterval(updateDate, 60000)

  // Check if install banner was dismissed
  if (localStorage.getItem('flywheel_install_dismissed') === 'true') {
    showInstallBanner.value = false
  }

  // Listen for service worker updates to update cache version
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      cacheVersion.value = getCacheVersion()
    })
  }
})
</script>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
  transition: padding-bottom 0.3s ease-out;
}

.app.has-install-banner {
  padding-bottom: calc(2rem + 100px);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-clickable {
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  /* Ensure minimum touch target size (44x44px) */
  min-height: 44px;
  display: inline-block;
  padding: 0.5rem 0;
}

.title-clickable:hover {
  opacity: 0.8;
}

.title-clickable:active,
.title-clickable.touching {
  opacity: 0.7;
  transform: scale(0.98);
}

.subtitle {
  color: #6b7280;
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

.mode-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 12px;
}

.mode-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.mode-btn.active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.main-content {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.date-display {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.date-display p {
  margin: 0;
  font-weight: 600;
  color: #374151;
  font-size: 1.1rem;
}

.add-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.habit-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.habit-input:focus {
  outline: none;
  border-color: #4f46e5;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover:not(:disabled) {
  background: #4338ca;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.habit-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.habit-item:hover {
  background: #f3f4f6;
}

.habit-item.checked {
  background: #ecfdf5;
  border-color: #10b981;
}

.habit-item.delete-mode {
  justify-content: space-between;
  cursor: default;
  position: relative;
}

.habit-item.delete-mode.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.habit-item.delete-mode.drag-over {
  border-top: 3px solid #4f46e5;
}

.drag-handle {
  cursor: grab;
  color: #9ca3af;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0 0.5rem;
  user-select: none;
  display: flex;
  align-items: center;
  letter-spacing: -0.2em;
}

.drag-handle:active {
  cursor: grabbing;
}

.habit-item.delete-mode:hover .drag-handle {
  color: #6b7280;
}

.checkbox {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  cursor: pointer;
  accent-color: #10b981;
}

.habit-name {
  flex: 1;
  font-size: 1rem;
  color: #374151;
  font-weight: 500;
}

.habit-item.checked .habit-name {
  color: #059669;
  text-decoration: line-through;
}

.delete-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #fecaca;
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

.install-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.install-banner-content {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.install-banner-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.install-banner-text strong {
  font-size: 1rem;
  font-weight: 600;
}

.install-banner-text span {
  font-size: 0.875rem;
  opacity: 0.9;
}

.install-banner-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.install-btn {
  padding: 0.5rem 1rem;
  background: white;
  color: #4f46e5;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}

.install-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.install-dismiss-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.install-dismiss-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.footer {
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

.version-info {
  margin: 0;
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: monospace;
}

@media (max-width: 640px) {
  .install-banner-content {
    flex-direction: column;
    align-items: stretch;
  }

  .install-banner-actions {
    width: 100%;
    justify-content: space-between;
  }

  .install-btn {
    flex: 1;
  }
}

@media (prefers-color-scheme: dark) {
  .app {
    background: #111827;
    color: #f9fafb;
  }

  .main-content {
    background: #1f2937;
  }

  .mode-toggle {
    background: #374151;
  }

  .mode-btn {
    color: #9ca3af;
  }

  .mode-btn.active {
    background: #374151;
    color: #818cf8;
  }

  .date-display p {
    color: #f9fafb;
  }

  .habit-input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .habit-item {
    background: #374151;
  }

  .habit-item:hover {
    background: #4b5563;
  }

  .habit-item.checked {
    background: #064e3b;
    border-color: #10b981;
  }

  .habit-name {
    color: #f9fafb;
  }

  .delete-btn {
    background: #7f1d1d;
    color: #fca5a5;
  }

  .delete-btn:hover {
    background: #991b1b;
  }

  .drag-handle {
    color: #6b7280;
  }

  .habit-item.delete-mode:hover .drag-handle {
    color: #9ca3af;
  }

  .habit-item.delete-mode.drag-over {
    border-top-color: #818cf8;
  }

  .footer {
    border-top-color: #374151;
  }

  .version-info {
    color: #6b7280;
  }
}
</style>

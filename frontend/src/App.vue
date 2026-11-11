<template>
  <AppShell>
    <template #header>
      <Header
        title="Flywheel"
        logo-url="/icon.svg"
        :sidebar-enabled="false"
        :theme-toggle-enabled="true"
        @logo-click="toggleSwitcher"
      >
        <template v-if="showSwitcher" #toolbar>
          <button
            type="button"
            class="inline-icon"
            :class="mode === 'check' ? 'good' : 'neutral'"
            :aria-pressed="mode === 'check'"
            @click="mode = 'check'"
          >
            <HugeiconsIcon :icon="CheckListIcon" width="1em" height="1em" :stroke-width="iconStrokeWidth" aria-hidden="true" />
            <span>Check List</span>
          </button>
          <button
            type="button"
            class="inline-icon"
            :class="mode === 'add' ? 'good' : 'neutral'"
            :aria-pressed="mode === 'add'"
            @click="mode = 'add'"
          >
            <HugeiconsIcon :icon="Edit02Icon" width="1em" height="1em" :stroke-width="iconStrokeWidth" aria-hidden="true" />
            <span>Edit List</span>
          </button>
        </template>
      </Header>
    </template>

    <template #banners>
      <NotificationBlock
        v-if="isInstallable && !isInstalled && showInstallBanner"
        type="note"
        label="Install"
        role="status"
        dismissible
        @dismiss="dismissInstall"
      >
        <span class="install-banner">
          <span>Add Flywheel to your home screen for quick access.</span>
          <button type="button" class="inline-icon good" @click.stop="handleInstall">
            <HugeiconsIcon :icon="Download04Icon" width="1em" height="1em" :stroke-width="iconStrokeWidth" aria-hidden="true" />
            <span>Install</span>
          </button>
        </span>
      </NotificationBlock>
    </template>

    <!-- Check List Mode (Default) -->
    <Section
      v-if="mode === 'check'"
      :title="formattedDate"
      subtitle="Build habits, one day at a time"
      :icon="CheckListIcon"
    >
      <p v-if="habits.length === 0" class="empty-state">
        No habits yet. Tap the Flywheel logo and choose "Edit List" to create your first habit!
      </p>
      <ul v-else class="habits-list">
        <li v-for="habit in habits" :key="habit.id">
          <label class="habit-item" :class="{ checked: isTicked(habit.id) }">
            <input
              type="checkbox"
              :checked="isTicked(habit.id)"
              @change="toggleHabit(habit.id)"
            />
            <span class="habit-name">{{ habit.name }}</span>
          </label>
        </li>
      </ul>
    </Section>

    <!-- Edit List Mode -->
    <Section v-if="mode === 'add'" title="Edit habits" :icon="Edit02Icon">
      <div class="add-form" role="group" aria-label="Add habit">
        <input
          v-model="newHabitName"
          type="text"
          @keyup.enter="addNewHabit"
          placeholder="Enter habit name (e.g., Brush Teeth)"
          aria-label="Habit name"
        />
        <button type="button" class="inline-icon good" :disabled="!newHabitName.trim()" @click="addNewHabit">
          <HugeiconsIcon :icon="Add01Icon" width="1em" height="1em" :stroke-width="iconStrokeWidth" aria-hidden="true" />
          <span>Add Habit</span>
        </button>
      </div>

      <ReorderList
        :model-value="habits"
        item-key="id"
        :item-label="(habit) => habit.name"
        aria-label="Habits"
        @update:model-value="onReorder"
      >
        <template #item="{ item }">
          <div class="edit-row">
            <span class="habit-name">{{ item.name }}</span>
            <button
              type="button"
              class="inline-icon bad"
              :aria-label="`Delete ${item.name}`"
              title="Delete habit"
              @click="deleteHabit(item.id)"
            >
              <HugeiconsIcon :icon="Delete02Icon" width="1em" height="1em" :stroke-width="iconStrokeWidth" aria-hidden="true" />
            </button>
          </div>
        </template>
        <template #empty>
          Start building your habits! Add your first one above.
        </template>
      </ReorderList>
    </Section>

    <template v-if="init.showFooter" #footer>
      <AppFooter
        :app-name="init.pageTitle"
        logo-url="/icon.svg"
        :current-version="init.currentVersion"
        :cache-version="init.cacheVersion"
        :show-version-number="init.showVersionNumber"
        :show-new-versions="init.showNewVersions"
        :available-version="init.availableVersion"
        :source-url="sourceUrl"
        :issues-url="issuesUrl"
        @update="applyUpdate"
      />
    </template>
  </AppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppShell from 'picocrank/vue/components/AppShell.vue'
import Header from 'picocrank/vue/components/Header.vue'
import Section from 'picocrank/vue/components/Section.vue'
import ReorderList from 'picocrank/vue/components/ReorderList.vue'
import NotificationBlock from 'picocrank/vue/components/NotificationBlock.vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Add01Icon,
  CheckListIcon,
  Delete02Icon,
  Download04Icon,
  Edit02Icon,
} from '@hugeicons/core-free-icons'
import {
  getHabits,
  addHabit as addHabitToStorage,
  deleteHabit as deleteHabitFromStorage,
  reorderHabits,
  isTicked,
  toggleTick
} from './utils/storage.js'
import { useInstallPrompt } from './composables/useInstallPrompt.js'
import { useInit } from './composables/useInit.js'
import AppFooter from './components/AppFooter.vue'

const iconStrokeWidth = 2.5

const mode = ref('check') // 'check' or 'add'
const habits = ref([])
const newHabitName = ref('')

const formattedDate = ref('')
const showSwitcher = ref(false) // Hidden by default; toggled by clicking the logo

// Footer state comes from Init (local stand-in; Flywheel has no backend)
const init = useInit()
const sourceUrl = 'https://github.com/jamesread/flywheel'
const issuesUrl = 'https://github.com/jamesread/flywheel/issues'

function applyUpdate() {
  if (typeof window !== 'undefined' && window.__SW_UPDATE__) {
    window.__SW_UPDATE__(true)
  } else {
    location.reload()
  }
}

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
  // Store dismissal in localStorage to not show again
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

function onReorder(newHabits) {
  habits.value = newHabits
  reorderHabits(newHabits.map(h => h.id))
}

function toggleSwitcher() {
  showSwitcher.value = !showSwitcher.value
}

onMounted(() => {
  updateDate()
  loadHabits()

  // Update date every minute to keep it current
  setInterval(updateDate, 60000)

  // Check if install banner was dismissed
  if (localStorage.getItem('flywheel_install_dismissed') === 'true') {
    showInstallBanner.value = false
  }
})
</script>

<style scoped>
.habits-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.habit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5em;
  cursor: pointer;
  user-select: none;
}

.habit-item:hover {
  background-color: var(--hover-background-color);
}

.habit-item.checked {
  background-color: var(--karma-good-wash);
  border-color: var(--karma-good);
}

.habit-item input[type='checkbox'] {
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
}

.habit-name {
  flex: 1;
  min-width: 0;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.habit-item.checked .habit-name {
  text-decoration: line-through;
}

.add-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.add-form input {
  flex: 1;
  min-width: 0;
  margin: 0;
}

.edit-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  margin: 0;
  opacity: 0.7;
}

.install-banner {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

</style>

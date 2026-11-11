<template>
  <!-- Rendered inside PicoCrank AppShell's <footer>, after <main>. -->
  <p>
    <img v-if="logoUrl" class="logo" :src="logoUrl" :alt="appName + ' logo'" style="height: 1em;">
    {{ appName }}
  </p>

  <p>
    <span v-if="showVersionNumber && currentVersion" id="current-version">v{{ currentVersion }}</span>
    <span v-if="showVersionNumber && cacheVersion">Cache {{ cacheVersion }}</span>
    <span v-if="sourceUrl">
      <a :href="sourceUrl" target="_blank" rel="noopener noreferrer">GitHub</a>
    </span>
    <span v-if="issuesUrl">
      <a :href="issuesUrl" target="_blank" rel="noopener noreferrer">Raise an issue</a>
    </span>
  </p>

  <p v-if="showUpdateLink">
    <a id="available-version" href="#" @click.prevent="$emit('update')">{{ availableVersion }}</a>
  </p>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  appName: { type: String, required: true },
  logoUrl: { type: String, default: '' },
  currentVersion: { type: String, default: '' },
  cacheVersion: { type: String, default: '' },
  showVersionNumber: { type: Boolean, default: true },
  showNewVersions: { type: Boolean, default: true },
  availableVersion: { type: String, default: '' },
  sourceUrl: { type: String, default: '' },
  issuesUrl: { type: String, default: '' },
})

defineEmits(['update'])

const showUpdateLink = computed(() => {
  if (!props.showVersionNumber || !props.showNewVersions) return false
  const v = (props.availableVersion || '').trim()
  if (!v || v === 'none' || v === '?' || v.startsWith('you-are-using')) return false
  return true
})
</script>

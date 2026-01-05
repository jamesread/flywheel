// Local storage utilities for habits and daily ticks

const HABITS_KEY = 'flywheel_habits'
const TICKS_KEY = 'flywheel_ticks'

export function getHabits() {
  const habits = localStorage.getItem(HABITS_KEY)
  return habits ? JSON.parse(habits) : []
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export function addHabit(habitName) {
  const habits = getHabits()
  const newHabit = {
    id: Date.now().toString(),
    name: habitName,
    createdAt: new Date().toISOString()
  }
  habits.push(newHabit)
  saveHabits(habits)
  return newHabit
}

export function deleteHabit(habitId) {
  const habits = getHabits()
  const filtered = habits.filter(h => h.id !== habitId)
  saveHabits(filtered)
}

export function reorderHabits(newOrder) {
  // newOrder is an array of habit IDs in the desired order
  const habits = getHabits()
  const habitMap = new Map(habits.map(h => [h.id, h]))
  const reordered = newOrder.map(id => habitMap.get(id)).filter(Boolean)
  saveHabits(reordered)
}

export function getTodayDateString() {
  const today = new Date()
  return today.toISOString().split('T')[0] // Returns YYYY-MM-DD
}

export function getTicksForDate(dateString) {
  const ticks = localStorage.getItem(TICKS_KEY)
  const allTicks = ticks ? JSON.parse(ticks) : {}
  return allTicks[dateString] || []
}

export function saveTicksForDate(dateString, tickedHabitIds) {
  const ticks = localStorage.getItem(TICKS_KEY)
  const allTicks = ticks ? JSON.parse(ticks) : {}
  allTicks[dateString] = tickedHabitIds
  localStorage.setItem(TICKS_KEY, JSON.stringify(allTicks))
}

export function toggleTick(habitId) {
  const today = getTodayDateString()
  const tickedIds = getTicksForDate(today)
  const index = tickedIds.indexOf(habitId)

  if (index > -1) {
    tickedIds.splice(index, 1)
  } else {
    tickedIds.push(habitId)
  }

  saveTicksForDate(today, tickedIds)
  return tickedIds
}

export function isTicked(habitId, dateString = null) {
  const date = dateString || getTodayDateString()
  const tickedIds = getTicksForDate(date)
  return tickedIds.includes(habitId)
}

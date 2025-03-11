<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Google 搜索...'
  }
})

const searchQuery = ref('')
const isSearchFocused = ref(false)

// Emit the focus state to parent component
const emit = defineEmits(['focus-change'])

watch(isSearchFocused, (newValue) => {
  emit('focus-change', newValue)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`
    window.open(searchUrl, '_blank')
    searchQuery.value = ''
  }
}
</script>

<template>
  <div class="search-container">
    <div class="custom-search-input">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        @focus="isSearchFocused = true"
        @blur="isSearchFocused = false"
        @keydown.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  z-index: 10;
}

.custom-search-input {
  width: 600px;
  max-width: 90%;
  position: relative;
  display: flex;
  align-items: center;
}

.custom-search-input input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.custom-search-input input:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.custom-search-input input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.custom-search-input input:focus {
  background-color: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 1);
  color: #333;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.custom-search-input input:focus::placeholder {
  color: #999;
}

.custom-search-input input:focus + .search-button {
  color: #333;
}

.search-button {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: white;
  transition:
    color 0.3s ease,
    transform 0.2s ease;
}

.search-button:hover {
  opacity: 0.8;
  transform: scale(1.1);
}
</style>

<template>
  <div v-if="isLoading" class="fixed inset-0 bg-gray-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLoading: boolean
}>()
</script>
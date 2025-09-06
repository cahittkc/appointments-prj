<template>
  <div v-if="isLoading" class="fixed inset-0 bg-gray-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div class="flex flex-col items-center space-y-4">
      <div class="relative">
        <Vue3Lottie 
          :animationData="realEstateAnimation" 
          :height="300" 
          :width="300" 
          :loop="true" 
          :autoPlay="true"
        />
      </div>
      <div class="text-gray-600 font-medium animate-pulse">Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import realEstateAnimationData from '../../public/real-estate.json'

defineProps<{
  isLoading: boolean
}>()

const realEstateAnimation = realEstateAnimationData
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes reverse-spin {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-reverse {
  animation: reverse-spin 1.5s linear infinite;
}
</style>
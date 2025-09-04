<template>
  <div v-if="isLoading" class="w-full h-full">
    <div class="flex items-center justify-between pb-8 border-b-2 border-b-gray-300">
       <div class="flex items-center gap-x-5">
          <div class="flex items-center gap-x-2 p-4">
           <template v-for="i in 5" :key="i">
             <div class="relative group -ml-3 first:ml-0">
               <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white animate-pulse"></div>
             </div>
           </template>
           <div class="relative group -ml-3">
             <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white animate-pulse"></div>
           </div>
         </div>
 
         <div class="flex items-center gap-x-3">
           <div class="w-[150px] h-[42px] bg-gray-200 rounded-lg animate-pulse"></div>
         </div>
 
         <div class="flex items-center gap-x-1.5">
           <div class="w-[240px] h-[42px] bg-gray-200 rounded-lg animate-pulse"></div>
           <div class="w-[240px] h-[42px] bg-gray-200 rounded-lg animate-pulse"></div>
         </div>
 
         <div>
           <div class="w-[80px] h-[42px] bg-gray-200 rounded-lg animate-pulse"></div>
         </div>
       </div>
       <div class="flex items-center group w-[300px]">
          <div class="w-full pl-10 pr-4 py-2.5 h-[42px] bg-gray-200 rounded-tl-lg rounded-bl-lg animate-pulse"></div>
          <div class="px-3 py-2.5 bg-gray-200 h-[42px] flex items-center justify-center rounded-tr-lg rounded-br-lg animate-pulse w-[42px]"></div>
        </div>
      </div>
    <div class="grid gap-2">
      <div v-for="i in numberOfPlaceholders" :key="i" class="cursor-pointer border border-gray-200 rounded-lg grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 shadow-sm hover:shadow py-4 animate-pulse bg-gray-100">
        <div class="py-3 px-4 flex items-center">
          <div class="flex flex-col gap-y-2.5 flex-1 items-start pl-16 max-xl:pl-8">
            <div class="h-4 w-48 bg-gray-200 rounded"></div>
            <div class="h-4 w-36 bg-gray-200 rounded"></div>
            <div class="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div class="flex items-center w-full">
          <div class="flex flex-col gap-y-2.5 flex-1 items-start pl-8 max-md:pl-12">
            <div class="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div class="py-3 px-4 flex items-center w-full">
          <div class="flex items-center justify-between gap-x-2.5 bg-gray-200 p-2 rounded-full flex-1 ml-8 max-w-[400px] max-xl:max-w-[300px] h-10"></div>
        </div>
        <div class="py-3 px-4 flex items-center justify-center max-xl:justify-start w-full">
          <div class="flex items-center gap-x-2 p-4 max-md:pl-8">
            <div class="w-10 h-10 rounded-full bg-gray-200"></div>
            <div class="w-10 h-10 rounded-full bg-gray-200 -ml-3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  isLoading: boolean
}>()

const numberOfPlaceholders = ref(5)

const calculatePlaceholders = () => {
  const containerHeight = window.innerHeight - 200 // Header ve diğer elementler için boşluk bırakıyoruz
  const cardHeight = 120 // Her bir kartın yaklaşık yüksekliği
  numberOfPlaceholders.value = Math.max(3, Math.floor(containerHeight / cardHeight))
}

onMounted(() => {
  calculatePlaceholders()
  window.addEventListener('resize', calculatePlaceholders)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculatePlaceholders)
})
</script>
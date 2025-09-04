<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto " aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div class="fixed inset-0 bg-gray-50/50 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

        <div class="relative flex flex-col min-h-[700px] h-[700px] transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="absolute top-0 right-0 mt-4 mr-4">
            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 cursor-pointer" @click="$emit('close')">
              <CircleX class="w-5 h-5" />
            </button>
          </div>
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 class="text-base font-semibold leading-6 text-gray-900 flex items-center justify-center" id="modal-title">
                  <slot name="title"></slot>
                </h3>
                <div class="mt-4">
                  <slot name="content"></slot>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-auto ml-auto">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { CircleX, ClosedCaption } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
<template>
  <Transition name="modal">
    <div v-if="isOpen" :class="`fixed inset-0 z-${zIndex}`" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Desktop Layout -->
      <div class="hidden sm:flex min-h-screen items-center justify-center p-4 text-center">
        <div class="fixed inset-0 bg-gray-50/50 transition-opacity" aria-hidden="true"></div>

        <div class="relative flex flex-col min-h-[500px] max-h-[80vh] transform rounded-lg bg-[#f4fafa] text-left shadow-xl transition-all my-8 w-full max-w-lg">
          <div class="px-6 pb-4 pt-5 flex-shrink-0">
            <h3 class="text-base font-semibold leading-6 text-gray-900 flex items-center justify-center" id="modal-title">
              <slot name="title"></slot>
            </h3>
          </div>
          <div class="flex-1 overflow-y-auto px-6 min-h-[600px]">
            <slot name="content"></slot>
          </div>
          <div class="flex items-center justify-end px-2 py-3  mt-auto">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="sm:hidden fixed inset-0 flex items-start justify-center p-2 top-[5%]">
        <div class="fixed inset-0 bg-gray-50/50 transition-opacity" aria-hidden="true"></div>
        <div class="relative bg-[#f4fafa] rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col">
          <div class="px-2 pt-6 flex-shrink-0">
            <h3 class="text-lg font-semibold leading-6 text-gray-900 text-center pb-2 flex items-center justify-center" id="modal-title">
              <slot name="title"></slot>
            </h3>
          </div>
          <div class="flex-1 overflow-y-auto px-2 ">
            <slot name="content"></slot>
          </div>
          <div class="px-4 py-4 rounded-b-lg">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = withDefaults(defineProps<{
  isOpen: boolean
  zIndex?: number
}>(), {
  zIndex: 50
})

defineEmits<{
  (e: 'close'): void
}>()

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})
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
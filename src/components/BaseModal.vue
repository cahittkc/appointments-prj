<template>
  <Transition name="modal">
    <div v-if="isOpen" :class="`fixed inset-0 z-${zIndex} overflow-y-auto`" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Desktop Layout -->
      <div class="hidden sm:flex min-h-screen items-center justify-center p-4 text-center">
        <div class="fixed inset-0 bg-gray-50/50 transition-opacity" aria-hidden="true"></div>

        <div class="relative flex flex-col min-h-[500px] transform rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full max-w-lg">
          <div class="bg-white px-6 pb-4 pt-5">
            <div class="flex items-start">
              <div class="mt-3 text-left w-full">
                <h3 class="text-base font-semibold leading-6 text-gray-900 flex items-center justify-center" id="modal-title">
                  <slot name="title"></slot>
                </h3>
                <div class="mt-4">
                  <slot name="content"></slot>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end px-6 py-3 flex-row-reverse mt-auto ml-auto">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="sm:hidden fixed inset-0 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-50/50 transition-opacity" aria-hidden="true"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col">
          <div class="flex-1 px-4 py-6 overflow-y-auto">
            <h3 class="text-lg font-semibold leading-6 text-gray-900 text-center mb-6" id="modal-title">
              <slot name="title"></slot>
            </h3>
            <div>
              <slot name="content"></slot>
            </div>
          </div>
          <div class="border-t border-gray-200 px-4 py-4 bg-gray-50 rounded-b-lg">
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
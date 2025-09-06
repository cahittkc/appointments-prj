<template>
  <div class="flex flex-col gap-y-2.5 max-md:gap-y-2 flex-1 items-start" :class="containerClass">
    <div class="text-sm max-md:text-xs font-medium text-gray-900 flex gap-x-2 items-center">
      <User class="w-5 h-5 max-md:w-4 max-md:h-4 text-gray-500 flex-shrink-0" />
      <span class="truncate">{{ displayName }}</span>
    </div>
    <div class="text-sm max-md:text-xs text-gray-500 flex items-center gap-x-2">
      <Mail class="w-5 h-5 max-md:w-4 max-md:h-4 text-gray-500 flex-shrink-0" />
      <span class="truncate">{{ displayEmail }}</span>
    </div>
    <div class="text-sm max-md:text-xs text-gray-500 flex items-center gap-x-2">
      <Phone class="w-5 h-5 max-md:w-4 max-md:h-4 text-gray-500 flex-shrink-0" />
      <span class="truncate">{{ displayPhone }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Mail, Phone } from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  contactName?: string | string[]
  contactSurname?: string | string[]
  contactEmail?: string | string[]
  contactPhone?: string | number | (string | number)[]
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  contactName: '',
  contactSurname: '',
  contactEmail: '',
  contactPhone: '',
  containerClass: 'pl-4 max-xl:pl-2 max-md:pl-0'
})

const displayName = computed(() => {
  const name = Array.isArray(props.contactName) ? props.contactName[0] : props.contactName
  const surname = Array.isArray(props.contactSurname) ? props.contactSurname[0] : props.contactSurname
  return `${name || ''} ${surname || ''}`.trim()
})

const displayEmail = computed(() => {
  return Array.isArray(props.contactEmail) ? props.contactEmail[0] : props.contactEmail
})

const displayPhone = computed(() => {
  if (Array.isArray(props.contactPhone)) {
    return props.contactPhone[0]?.toString() || ''
  }
  return props.contactPhone?.toString() || ''
})
</script>
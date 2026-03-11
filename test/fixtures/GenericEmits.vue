<template>
  <button @click="$emit('click', $event)">Click</button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  /** Emitted on click */
  click: [payload: MouseEvent];
  /** Emitted when value changes */
  change: [value: string, oldValue: string];
}>();
</script>

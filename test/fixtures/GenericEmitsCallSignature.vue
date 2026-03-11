<template>
  <button @click="$emit('click', $event)">Click</button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  /** Emitted on click */
  (e: "click", payload: MouseEvent): void;
  /** Emitted on submit */
  (e: "submit"): void;
}>();
</script>

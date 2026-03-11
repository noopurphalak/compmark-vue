<template>
  <div>{{ label }}</div>
</template>

<script setup lang="ts">
defineProps({
  /**
   * The label
   * @deprecated Use `text` instead
   */
  label: {
    type: String,
    required: true,
  },
  /**
   * Old color prop
   * @deprecated
   */
  color: String,
});
</script>

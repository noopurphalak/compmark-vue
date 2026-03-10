<script setup>
defineProps({
  /** Can be a string or number */
  value: [String, Number],
  /** Accepts multiple types */
  data: [Object, Array],
});
</script>

<template>
  <span>{{ value }}</span>
</template>

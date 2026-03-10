<script setup>
defineProps({
  /** The name value */
  name: String,
  age: Number,
  active: Boolean,
});
</script>

<template>
  <span>{{ name }}</span>
</template>

<script setup>
/**
 * @emit click Emitted when clicked
 * @emit update Emitted when value updates
 */
defineEmits(["click", "update"]);
</script>

<template>
  <button @click="$emit('click')">Click me</button>
</template>

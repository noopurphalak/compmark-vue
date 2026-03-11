<template>
  <div>
    <slot />
    <slot name="header" :title="title" />
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
const title = "Hello";
</script>

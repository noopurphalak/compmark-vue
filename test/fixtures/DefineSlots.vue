<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineSlots<{
  /** The default content */
  default(props: { msg: string }): any;
  /** Header area */
  header(props: { title: string; count: number }): any;
}>();
</script>

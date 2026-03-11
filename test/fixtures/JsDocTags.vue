<template>
  <div>{{ label }}</div>
</template>

<script setup lang="ts">
defineProps<{
  /**
   * The label text
   * @deprecated Use `text` instead
   * @since 1.0.0
   * @example "Hello World"
   * @see https://example.com
   */
  label: string;
  /**
   * The color
   * @deprecated
   */
  color?: string;
  /**
   * The size
   * @since 2.0.0
   */
  size?: number;
}>();
</script>

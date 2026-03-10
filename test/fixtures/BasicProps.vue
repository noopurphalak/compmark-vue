<script setup>
defineProps({
  /** The label text */
  label: {
    type: String,
    required: true,
  },
  /** Whether the button is disabled */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Size of the component */
  size: {
    type: String,
    default: "medium",
  },
  /** Maximum count */
  count: {
    type: Number,
    default: 10,
  },
});
</script>

<template>
  <button :disabled="disabled">{{ label }}</button>
</template>

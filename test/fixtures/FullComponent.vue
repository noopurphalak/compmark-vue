<script setup>
/**
 * @emit submit Emitted on form submit
 * @emit cancel Emitted on cancel
 */
const emit = defineEmits(["submit", "cancel"]);

const props = defineProps({
  /** Title of the dialog */
  title: {
    type: String,
    required: true,
  },
  /** Whether the dialog is visible */
  visible: {
    type: Boolean,
    default: false,
  },
  /** Custom items */
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div v-if="visible">
    <h2>{{ title }}</h2>
    <slot />
    <button @click="emit('submit')">Submit</button>
    <button @click="emit('cancel')">Cancel</button>
  </div>
</template>

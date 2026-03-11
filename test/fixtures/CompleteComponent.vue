<template>
  <div>
    <slot />
    <slot name="actions" :count="items.length" />
  </div>
</template>

<script setup lang="ts">
import { useMouse } from "@vueuse/core";

const { x, y } = useMouse();

const props = withDefaults(
  defineProps<{
    /** The title */
    title: string;
    /**
     * Max items to show
     * @since 1.2.0
     */
    maxItems?: number;
  }>(),
  {
    maxItems: 10,
  },
);

const emit = defineEmits<{
  /** Emitted on save */
  save: [data: Record<string, unknown>];
  /** Emitted on cancel */
  cancel: [];
}>();

defineSlots<{
  /** Main content */
  default(props: {}): any;
  /** Action buttons */
  actions(props: { count: number }): any;
}>();

defineExpose({
  /** Reset the form */
  reset,
});

const items = [1, 2, 3];

function reset() {}
</script>

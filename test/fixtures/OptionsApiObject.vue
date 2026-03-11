<template>
  <div>{{ label }}</div>
</template>

<script>
export default {
  props: ["label", "value"],
  emits: {
    /** Emitted on click */
    click: null,
    /** Emitted on submit with payload */
    submit: (payload) => typeof payload === "string",
  },
};
</script>

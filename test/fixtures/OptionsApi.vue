<template>
  <div>{{ title }}</div>
</template>

<script>
export default {
  props: {
    /** The title text */
    title: {
      type: String,
      required: true,
    },
    /** Maximum count */
    count: {
      type: Number,
      default: 10,
    },
  },
  emits: ["click", "update"],
};
</script>

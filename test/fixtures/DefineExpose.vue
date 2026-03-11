<template>
  <div>Exposed component</div>
</template>

<script setup lang="ts">
function focus() {
  // focus logic
}

function reset() {
  // reset logic
}

defineExpose({
  /** Focus the component */
  focus,
  /** Reset the component state */
  reset,
});
</script>

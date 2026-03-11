<template>
  <div>{{ x }}, {{ y }}</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMouse } from "@vueuse/core";

const router = useRouter();
const { x, y } = useMouse();
</script>

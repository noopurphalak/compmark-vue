# compmark-vue

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/compmark-vue?color=yellow)](https://npmjs.com/package/compmark-vue)
[![npm downloads](https://img.shields.io/npm/dm/compmark-vue?color=yellow)](https://npm.chart.dev/compmark-vue)

<!-- /automd -->

Auto-generate Markdown documentation from Vue 3 SFCs. Zero configuration required.

## Quick Start

```sh
npx compmark-vue ./src/components/Button.vue
```

This parses the component and creates `Button.md` in your current directory.

## Features

- [Props](#props) — runtime and TypeScript generic syntax
- [Emits](#emits) — array, TypeScript property, and call signature syntax
- [Slots](#slots) — `defineSlots` with typed bindings, template `<slot>` fallback
- [Expose](#expose) — `defineExpose` with JSDoc descriptions
- [Composables](#composables) — auto-detects `useX()` calls in `<script setup>`
- [JSDoc tags](#jsdoc-tags) — `@deprecated`, `@since`, `@example`, `@see`, `@default`
- [`@internal`](#internal-components) — exclude components from output
- [Options API](#options-api) — `export default { props, emits }` support
- Empty sections are skipped cleanly — no placeholder noise

## Examples

### Props

Runtime syntax, TypeScript generics, and `withDefaults` are all supported:

```vue
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** The label text */
    label: string;
    /** Visual theme */
    theme?: "filled" | "outline";
    disabled?: boolean;
  }>(),
  {
    theme: "filled",
    disabled: false,
  },
);
</script>
```

Output:

```md
## Props

| Name     | Type                  | Required | Default    | Description    |
| -------- | --------------------- | -------- | ---------- | -------------- |
| label    | string                | Yes      | -          | The label text |
| theme    | 'filled' \| 'outline' | No       | `"filled"` | Visual theme   |
| disabled | boolean               | No       | `false`    | -              |
```

Runtime object syntax is also supported:

```vue
<script setup>
defineProps({
  /** Title of the dialog */
  title: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
</script>
```

### Emits

TypeScript generic syntax with payloads:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  /** Emitted on save */
  save: [data: Record<string, unknown>];
  /** Emitted on cancel */
  cancel: [];
}>();
</script>
```

Output:

```md
## Emits

| Name   | Payload                       | Description       |
| ------ | ----------------------------- | ----------------- |
| save   | data: Record<string, unknown> | Emitted on save   |
| cancel | -                             | Emitted on cancel |
```

Call signature syntax is also supported:

```vue
<script setup lang="ts">
defineEmits<{
  (e: "click", payload: MouseEvent): void;
  (e: "submit"): void;
}>();
</script>
```

Array syntax works too: `defineEmits(["click", "submit"])`.

### Slots

`defineSlots` provides typed bindings:

```vue
<script setup lang="ts">
defineSlots<{
  /** Main content */
  default(props: { msg: string }): any;
  /** Header area */
  header(props: { title: string; count: number }): any;
}>();
</script>
```

Output:

```md
## Slots

| Name    | Bindings                     | Description  |
| ------- | ---------------------------- | ------------ |
| default | msg: string                  | Main content |
| header  | title: string, count: number | Header area  |
```

If `defineSlots` is not used, slots are extracted from template `<slot>` elements as a fallback:

```vue
<template>
  <div>
    <slot />
    <slot name="header" :title="title" />
    <slot name="footer" />
  </div>
</template>
```

### Expose

```vue
<script setup lang="ts">
defineExpose({
  /** Focus the component */
  focus,
  /** Reset the component state */
  reset,
});
</script>
```

Output:

```md
## Exposed

| Name  | Type    | Description               |
| ----- | ------- | ------------------------- |
| focus | unknown | Focus the component       |
| reset | unknown | Reset the component state |
```

### Composables

Any `useX()` calls in `<script setup>` are automatically detected:

```vue
<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMouse } from "@vueuse/core";

const router = useRouter();
const { x, y } = useMouse();
</script>
```

Output:

```md
## Composables Used

- `useRouter`
- `useMouse`
```

### JSDoc Tags

Props support `@deprecated`, `@since`, `@example`, and `@see`:

```vue
<script setup lang="ts">
defineProps<{
  /**
   * The label text
   * @deprecated Use `text` instead
   * @since 1.0.0
   * @example "Hello World"
   * @see https://example.com/docs
   */
  label: string;
}>();
</script>
```

Output:

````md
## Props

| Name  | Type   | Required | Default | Description                                                                                     |
| ----- | ------ | -------- | ------- | ----------------------------------------------------------------------------------------------- |
| label | string | Yes      | -       | The label text **Deprecated**: Use `text` instead _(since 1.0.0)_ See: https://example.com/docs |

**`label` example:**

```
"Hello World"
```
````

### Internal Components

Mark a component with `@internal` to skip it during generation:

```vue
<script setup lang="ts">
/**
 * @internal
 */
defineProps<{
  value: string;
}>();
</script>
```

```sh
$ compmark InternalHelper.vue
Skipped InternalHelper.vue (marked @internal)
```

### Options API

Components using `export default {}` are supported:

```vue
<script>
export default {
  props: {
    /** The title text */
    title: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 10,
    },
  },
  emits: ["click", "update"],
};
</script>
```

Output:

```md
## Props

| Name  | Type   | Required | Default | Description    |
| ----- | ------ | -------- | ------- | -------------- |
| title | String | Yes      | -       | The title text |
| count | Number | No       | `10`    | -              |

## Emits

| Name   | Description |
| ------ | ----------- |
| click  | -           |
| update | -           |
```

## Programmatic API

```sh
pnpm install compmark-vue
```

```ts
import { parseComponent, generateMarkdown } from "compmark-vue";

const doc = parseComponent("./src/components/Button.vue");
const md = generateMarkdown(doc);
```

Or parse from a string:

```ts
import { parseSFC, generateMarkdown } from "compmark-vue";

const doc = parseSFC(source, "Button.vue");
const md = generateMarkdown(doc);
```

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

Published under the [MIT](https://github.com/noopurphalak/compmark-vue/blob/main/LICENSE) license.

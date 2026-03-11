import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseSFC } from "../src/parser.ts";

function loadFixture(name: string) {
  const path = resolve(import.meta.dirname!, "fixtures", name);
  return readFileSync(path, "utf-8");
}

describe("parseSFC", () => {
  it("derives component name from filename", () => {
    const doc = parseSFC("<template><div/></template>", "MyButton.vue");
    expect(doc.name).toBe("MyButton");
  });

  it("parses basic runtime props", () => {
    const source = loadFixture("BasicProps.vue");
    const doc = parseSFC(source, "BasicProps.vue");

    expect(doc.props).toHaveLength(4);

    const label = doc.props.find((p) => p.name === "label")!;
    expect(label.type).toBe("String");
    expect(label.required).toBe(true);
    expect(label.default).toBeUndefined();

    const disabled = doc.props.find((p) => p.name === "disabled")!;
    expect(disabled.type).toBe("Boolean");
    expect(disabled.required).toBe(false);
    expect(disabled.default).toBe("false");

    const size = doc.props.find((p) => p.name === "size")!;
    expect(size.type).toBe("String");
    expect(size.default).toBe('"medium"');

    const count = doc.props.find((p) => p.name === "count")!;
    expect(count.type).toBe("Number");
    expect(count.default).toBe("10");
  });

  it("extracts JSDoc descriptions for props", () => {
    const source = loadFixture("BasicProps.vue");
    const doc = parseSFC(source, "BasicProps.vue");

    const label = doc.props.find((p) => p.name === "label")!;
    expect(label.description).toBe("The label text");

    const disabled = doc.props.find((p) => p.name === "disabled")!;
    expect(disabled.description).toBe("Whether the button is disabled");
  });

  it("parses shorthand type syntax", () => {
    const source = loadFixture("ShorthandProps.vue");
    const doc = parseSFC(source, "ShorthandProps.vue");

    expect(doc.props).toHaveLength(3);

    const name = doc.props.find((p) => p.name === "name")!;
    expect(name.type).toBe("String");
    expect(name.required).toBe(false);
    expect(name.default).toBeUndefined();

    const age = doc.props.find((p) => p.name === "age")!;
    expect(age.type).toBe("Number");

    const active = doc.props.find((p) => p.name === "active")!;
    expect(active.type).toBe("Boolean");
  });

  it("parses shorthand props JSDoc", () => {
    const source = loadFixture("ShorthandProps.vue");
    const doc = parseSFC(source, "ShorthandProps.vue");

    const name = doc.props.find((p) => p.name === "name")!;
    expect(name.description).toBe("The name value");
  });

  it("parses array type syntax", () => {
    const source = loadFixture("ArrayTypeProps.vue");
    const doc = parseSFC(source, "ArrayTypeProps.vue");

    expect(doc.props).toHaveLength(2);

    const value = doc.props.find((p) => p.name === "value")!;
    expect(value.type).toBe("String | Number");

    const data = doc.props.find((p) => p.name === "data")!;
    expect(data.type).toBe("Object | Array");
  });

  it("parses array emits", () => {
    const source = loadFixture("BasicEmits.vue");
    const doc = parseSFC(source, "BasicEmits.vue");

    expect(doc.emits).toHaveLength(2);
    expect(doc.emits[0]!.name).toBe("click");
    expect(doc.emits[1]!.name).toBe("update");
  });

  it("extracts JSDoc descriptions for emits", () => {
    const source = loadFixture("BasicEmits.vue");
    const doc = parseSFC(source, "BasicEmits.vue");

    expect(doc.emits[0]!.description).toBe("Emitted when clicked");
    expect(doc.emits[1]!.description).toBe("Emitted when value updates");
  });

  it("returns empty for no-script component", () => {
    const source = loadFixture("NoScript.vue");
    const doc = parseSFC(source, "NoScript.vue");

    expect(doc.props).toHaveLength(0);
    expect(doc.emits).toHaveLength(0);
  });

  it("returns empty for empty setup component", () => {
    const source = loadFixture("EmptySetup.vue");
    const doc = parseSFC(source, "EmptySetup.vue");

    expect(doc.props).toHaveLength(0);
    expect(doc.emits).toHaveLength(0);
  });

  it("handles const props = defineProps(...) pattern", () => {
    const source = loadFixture("FullComponent.vue");
    const doc = parseSFC(source, "FullComponent.vue");

    expect(doc.props.length).toBeGreaterThan(0);
    const title = doc.props.find((p) => p.name === "title")!;
    expect(title.type).toBe("String");
    expect(title.required).toBe(true);
    expect(title.description).toBe("Title of the dialog");
  });

  it("handles const emit = defineEmits(...) pattern", () => {
    const source = loadFixture("FullComponent.vue");
    const doc = parseSFC(source, "FullComponent.vue");

    expect(doc.emits).toHaveLength(2);
    expect(doc.emits[0]!.name).toBe("submit");
    expect(doc.emits[1]!.name).toBe("cancel");
  });

  it("extracts function default values", () => {
    const source = loadFixture("FullComponent.vue");
    const doc = parseSFC(source, "FullComponent.vue");

    const items = doc.props.find((p) => p.name === "items")!;
    expect(items.default).toBe("() => []");
  });

  it("parses type-based defineProps", () => {
    const source = loadFixture("TypeProps.vue");
    const doc = parseSFC(source, "TypeProps.vue");

    expect(doc.props).toHaveLength(5);

    const theme = doc.props.find((p) => p.name === "theme")!;
    expect(theme.type).toBe("'filled' | 'outline'");
    expect(theme.required).toBe(false);

    const disabled = doc.props.find((p) => p.name === "disabled")!;
    expect(disabled.type).toBe("boolean");
    expect(disabled.required).toBe(true);

    const count = doc.props.find((p) => p.name === "count")!;
    expect(count.type).toBe("number");
    expect(count.required).toBe(false);

    const classes = doc.props.find((p) => p.name === "classes")!;
    expect(classes.type).toBe("string[]");
  });

  it("extracts JSDoc from type-based props", () => {
    const source = loadFixture("TypeProps.vue");
    const doc = parseSFC(source, "TypeProps.vue");

    const theme = doc.props.find((p) => p.name === "theme")!;
    expect(theme.description).toBe("The visual theme");

    const disabled = doc.props.find((p) => p.name === "disabled")!;
    expect(disabled.description).toBe("Whether the button is disabled");
  });

  it("parses withDefaults + type-based defineProps", () => {
    const source = loadFixture("WithDefaults.vue");
    const doc = parseSFC(source, "WithDefaults.vue");

    expect(doc.props).toHaveLength(4);

    const theme = doc.props.find((p) => p.name === "theme")!;
    expect(theme.type).toBe("'filled' | 'outline'");
    expect(theme.required).toBe(false);
    expect(theme.default).toBe('"filled"');

    const type = doc.props.find((p) => p.name === "type")!;
    expect(type.default).toBe('"button"');

    const disabled = doc.props.find((p) => p.name === "disabled")!;
    expect(disabled.default).toBe("false");

    const items = doc.props.find((p) => p.name === "items")!;
    expect(items.default).toBe("() => ({})");
  });

  it("withDefaults coexists with defineEmits", () => {
    const source = loadFixture("WithDefaults.vue");
    const doc = parseSFC(source, "WithDefaults.vue");

    expect(doc.props.length).toBeGreaterThan(0);
    expect(doc.emits).toHaveLength(2);
    expect(doc.emits[0]!.name).toBe("click");
    expect(doc.emits[1]!.name).toBe("change");
  });

  // --- Phase 2: TS generic emits ---

  describe("TS generic defineEmits", () => {
    it("extracts emit names and payloads from property signature syntax", () => {
      const source = loadFixture("GenericEmits.vue");
      const doc = parseSFC(source, "GenericEmits.vue");

      expect(doc.emits).toHaveLength(2);

      const click = doc.emits.find((e) => e.name === "click")!;
      expect(click.description).toBe("Emitted on click");
      expect(click.payload).toBe("payload: MouseEvent");

      const change = doc.emits.find((e) => e.name === "change")!;
      expect(change.description).toBe("Emitted when value changes");
      expect(change.payload).toBe("value: string, oldValue: string");
    });

    it("extracts emit names and payloads from call signature syntax", () => {
      const source = loadFixture("GenericEmitsCallSignature.vue");
      const doc = parseSFC(source, "GenericEmitsCallSignature.vue");

      expect(doc.emits).toHaveLength(2);

      const click = doc.emits.find((e) => e.name === "click")!;
      expect(click.description).toBe("Emitted on click");
      expect(click.payload).toBe("payload: MouseEvent");

      const submit = doc.emits.find((e) => e.name === "submit")!;
      expect(submit.description).toBe("Emitted on submit");
      expect(submit.payload).toBeUndefined();
    });
  });

  // --- Phase 2: defineSlots ---

  describe("defineSlots", () => {
    it("extracts typed slot definitions", () => {
      const source = loadFixture("DefineSlots.vue");
      const doc = parseSFC(source, "DefineSlots.vue");

      expect(doc.slots).toHaveLength(2);

      const defaultSlot = doc.slots!.find((s) => s.name === "default")!;
      expect(defaultSlot.description).toBe("The default content");
      expect(defaultSlot.bindings).toEqual(["msg: string"]);

      const header = doc.slots!.find((s) => s.name === "header")!;
      expect(header.description).toBe("Header area");
      expect(header.bindings).toEqual(["title: string", "count: number"]);
    });
  });

  // --- Phase 2: template slots ---

  describe("template slot extraction", () => {
    it("extracts slots from template", () => {
      const source = loadFixture("TemplateSlots.vue");
      const doc = parseSFC(source, "TemplateSlots.vue");

      expect(doc.slots).toHaveLength(3);

      const defaultSlot = doc.slots!.find((s) => s.name === "default")!;
      expect(defaultSlot).toBeDefined();

      const header = doc.slots!.find((s) => s.name === "header")!;
      expect(header).toBeDefined();
      expect(header.bindings).toContain("title");

      const footer = doc.slots!.find((s) => s.name === "footer")!;
      expect(footer).toBeDefined();
    });

    it("defineSlots overrides template slots (pure fallback)", () => {
      const source = loadFixture("DefineSlots.vue");
      const doc = parseSFC(source, "DefineSlots.vue");

      // DefineSlots.vue has defineSlots with "default" and "header"
      // Template has just <slot /> (default)
      // defineSlots completely overrides template slots — pure fallback behavior
      expect(doc.slots).toHaveLength(2);
      const names = doc.slots!.map((s) => s.name);
      expect(names).toContain("default");
      expect(names).toContain("header");
      // The defineSlots version has typed bindings
      const defaultSlot = doc.slots!.find((s) => s.name === "default")!;
      expect(defaultSlot.bindings).toEqual(["msg: string"]);
    });

    it("extracts slots from template-only component (no script content)", () => {
      const source = `<template>
  <div>
    <slot name="nav-panel" />
    <slot name="content-panel" />
    <slot name="survey-footer" />
  </div>
</template>

<script setup></script>`;
      const doc = parseSFC(source, "TemplateOnly.vue");

      expect(doc.slots).toHaveLength(3);
      const names = doc.slots!.map((s) => s.name);
      expect(names).toContain("nav-panel");
      expect(names).toContain("content-panel");
      expect(names).toContain("survey-footer");
    });
  });

  // --- Phase 2: defineExpose ---

  describe("defineExpose", () => {
    it("extracts exposed methods with JSDoc", () => {
      const source = loadFixture("DefineExpose.vue");
      const doc = parseSFC(source, "DefineExpose.vue");

      expect(doc.exposes).toHaveLength(2);

      const focus = doc.exposes!.find((e) => e.name === "focus")!;
      expect(focus.type).toBe("unknown");
      expect(focus.description).toBe("Focus the component");

      const reset = doc.exposes!.find((e) => e.name === "reset")!;
      expect(reset.description).toBe("Reset the component state");
    });
  });

  // --- Phase 2: composable detection ---

  describe("composable detection", () => {
    it("detects composable calls (use* pattern)", () => {
      const source = loadFixture("Composables.vue");
      const doc = parseSFC(source, "Composables.vue");

      expect(doc.composables).toHaveLength(2);

      const names = doc.composables!.map((c) => c.name);
      expect(names).toContain("useRouter");
      expect(names).toContain("useMouse");
    });

    it("does not include non-composable calls", () => {
      const source = loadFixture("Composables.vue");
      const doc = parseSFC(source, "Composables.vue");

      const names = doc.composables!.map((c) => c.name);
      // should not include defineProps, etc.
      expect(names).not.toContain("defineProps");
    });
  });

  // --- Phase 2: JSDoc tags ---

  describe("JSDoc tags", () => {
    it("extracts @deprecated, @since, @example, @see from TS props", () => {
      const source = loadFixture("JsDocTags.vue");
      const doc = parseSFC(source, "JsDocTags.vue");

      const label = doc.props.find((p) => p.name === "label")!;
      expect(label.description).toBe("The label text");
      expect(label.deprecated).toBe("Use `text` instead");
      expect(label.since).toBe("1.0.0");
      expect(label.example).toBe('"Hello World"');
      expect(label.see).toBe("https://example.com");
    });

    it("handles @deprecated without reason", () => {
      const source = loadFixture("JsDocTags.vue");
      const doc = parseSFC(source, "JsDocTags.vue");

      const color = doc.props.find((p) => p.name === "color")!;
      expect(color.deprecated).toBe(true);
    });

    it("extracts @since independently", () => {
      const source = loadFixture("JsDocTags.vue");
      const doc = parseSFC(source, "JsDocTags.vue");

      const size = doc.props.find((p) => p.name === "size")!;
      expect(size.since).toBe("2.0.0");
      expect(size.deprecated).toBeUndefined();
    });

    it("extracts @deprecated from runtime props", () => {
      const source = loadFixture("DeprecatedRuntime.vue");
      const doc = parseSFC(source, "DeprecatedRuntime.vue");

      const label = doc.props.find((p) => p.name === "label")!;
      expect(label.deprecated).toBe("Use `text` instead");

      const color = doc.props.find((p) => p.name === "color")!;
      expect(color.deprecated).toBe(true);
    });
  });

  // --- Phase 2: @internal ---

  describe("@internal component", () => {
    it("detects @internal tag on component", () => {
      const source = loadFixture("InternalComponent.vue");
      const doc = parseSFC(source, "InternalComponent.vue");

      expect(doc.internal).toBe(true);
    });

    it("non-internal components have internal=false or undefined", () => {
      const source = loadFixture("BasicProps.vue");
      const doc = parseSFC(source, "BasicProps.vue");

      expect(doc.internal).toBeFalsy();
    });
  });

  // --- Phase 2: Options API ---

  describe("Options API", () => {
    it("extracts props from Options API object syntax", () => {
      const source = loadFixture("OptionsApi.vue");
      const doc = parseSFC(source, "OptionsApi.vue");

      expect(doc.props).toHaveLength(2);

      const title = doc.props.find((p) => p.name === "title")!;
      expect(title.type).toBe("String");
      expect(title.required).toBe(true);
      expect(title.description).toBe("The title text");

      const count = doc.props.find((p) => p.name === "count")!;
      expect(count.type).toBe("Number");
      expect(count.default).toBe("10");
      expect(count.description).toBe("Maximum count");
    });

    it("extracts emits from Options API array syntax", () => {
      const source = loadFixture("OptionsApi.vue");
      const doc = parseSFC(source, "OptionsApi.vue");

      expect(doc.emits).toHaveLength(2);
      expect(doc.emits[0]!.name).toBe("click");
      expect(doc.emits[1]!.name).toBe("update");
    });

    it("extracts props from Options API array syntax", () => {
      const source = loadFixture("OptionsApiObject.vue");
      const doc = parseSFC(source, "OptionsApiObject.vue");

      expect(doc.props).toHaveLength(2);

      const label = doc.props.find((p) => p.name === "label")!;
      expect(label.type).toBe("unknown");

      const value = doc.props.find((p) => p.name === "value")!;
      expect(value.type).toBe("unknown");
    });

    it("extracts emits from Options API object (validation) syntax", () => {
      const source = loadFixture("OptionsApiObject.vue");
      const doc = parseSFC(source, "OptionsApiObject.vue");

      expect(doc.emits).toHaveLength(2);

      const click = doc.emits.find((e) => e.name === "click")!;
      expect(click).toBeDefined();
      expect(click.description).toBe("Emitted on click");

      const submit = doc.emits.find((e) => e.name === "submit")!;
      expect(submit).toBeDefined();
      expect(submit.description).toBe("Emitted on submit with payload");
    });

    it("returns empty for script without export default", () => {
      const source = loadFixture("NoExportDefault.vue");
      const doc = parseSFC(source, "NoExportDefault.vue");

      expect(doc.props).toHaveLength(0);
      expect(doc.emits).toHaveLength(0);
    });
  });

  // --- Phase 2: Complete / kitchen-sink ---

  describe("complete component", () => {
    it("extracts all features from a kitchen-sink component", () => {
      const source = loadFixture("CompleteComponent.vue");
      const doc = parseSFC(source, "CompleteComponent.vue");

      // Props
      expect(doc.props).toHaveLength(2);
      const title = doc.props.find((p) => p.name === "title")!;
      expect(title.required).toBe(true);

      const maxItems = doc.props.find((p) => p.name === "maxItems")!;
      expect(maxItems.since).toBe("1.2.0");
      expect(maxItems.default).toBe("10");

      // Emits
      expect(doc.emits).toHaveLength(2);
      const save = doc.emits.find((e) => e.name === "save")!;
      expect(save.payload).toBeDefined();

      // Slots (from defineSlots, not duplicated by template)
      expect(doc.slots!.length).toBeGreaterThanOrEqual(2);
      const actionsSlot = doc.slots!.find((s) => s.name === "actions")!;
      expect(actionsSlot).toBeDefined();

      // Exposes
      expect(doc.exposes).toHaveLength(1);
      expect(doc.exposes![0]!.name).toBe("reset");

      // Composables
      expect(doc.composables).toHaveLength(1);
      expect(doc.composables![0]!.name).toBe("useMouse");
    });
  });
});

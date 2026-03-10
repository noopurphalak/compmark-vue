import { describe, it, expect } from "vitest";
import { generateMarkdown } from "../src/markdown.ts";
import type { ComponentDoc } from "../src/types.ts";

describe("generateMarkdown", () => {
  it("generates correct props table", () => {
    const doc: ComponentDoc = {
      name: "Button",
      props: [
        {
          name: "label",
          type: "String",
          required: true,
          default: undefined,
          description: "The label text",
        },
        {
          name: "disabled",
          type: "Boolean",
          required: false,
          default: "false",
          description: "",
        },
      ],
      emits: [],
    };

    const md = generateMarkdown(doc);
    expect(md).toContain("# Button");
    expect(md).toContain("## Props");
    expect(md).toContain("| label | String | Yes | - | The label text |");
    expect(md).toContain("| disabled | Boolean | No | `false` | - |");
  });

  it("generates correct emits table", () => {
    const doc: ComponentDoc = {
      name: "Button",
      props: [],
      emits: [
        { name: "click", description: "Emitted when clicked" },
        { name: "update", description: "" },
      ],
    };

    const md = generateMarkdown(doc);
    expect(md).toContain("## Emits");
    expect(md).toContain("| click | Emitted when clicked |");
    expect(md).toContain("| update | - |");
  });

  it("omits props section when no props", () => {
    const doc: ComponentDoc = {
      name: "Button",
      props: [],
      emits: [{ name: "click", description: "" }],
    };

    const md = generateMarkdown(doc);
    expect(md).not.toContain("## Props");
    expect(md).toContain("## Emits");
  });

  it("omits emits section when no emits", () => {
    const doc: ComponentDoc = {
      name: "Button",
      props: [
        {
          name: "label",
          type: "String",
          required: true,
          default: undefined,
          description: "",
        },
      ],
      emits: [],
    };

    const md = generateMarkdown(doc);
    expect(md).toContain("## Props");
    expect(md).not.toContain("## Emits");
  });

  it("shows no documentable message when both empty", () => {
    const doc: ComponentDoc = {
      name: "Empty",
      props: [],
      emits: [],
    };

    const md = generateMarkdown(doc);
    expect(md).toContain("No documentable props or emits found.");
    expect(md).not.toContain("## Props");
    expect(md).not.toContain("## Emits");
  });

  it("wraps defaults in backtick code spans", () => {
    const doc: ComponentDoc = {
      name: "Button",
      props: [
        {
          name: "size",
          type: "String",
          required: false,
          default: '"medium"',
          description: "",
        },
      ],
      emits: [],
    };

    const md = generateMarkdown(doc);
    expect(md).toContain('`"medium"`');
  });
});

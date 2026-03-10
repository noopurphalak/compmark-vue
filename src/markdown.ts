import type { ComponentDoc } from "./types.ts";

export function generateMarkdown(doc: ComponentDoc): string {
  const sections: string[] = [`# ${doc.name}`];

  if (doc.props.length === 0 && doc.emits.length === 0) {
    sections.push("", "No documentable props or emits found.");
    return sections.join("\n") + "\n";
  }

  if (doc.props.length > 0) {
    sections.push("", "## Props", "");
    sections.push("| Name | Type | Required | Default | Description |");
    sections.push("| --- | --- | --- | --- | --- |");
    for (const p of doc.props) {
      const def = p.default !== undefined ? `\`${p.default}\`` : "-";
      const desc = p.description || "-";
      const req = p.required ? "Yes" : "No";
      sections.push(`| ${p.name} | ${p.type} | ${req} | ${def} | ${desc} |`);
    }
  }

  if (doc.emits.length > 0) {
    sections.push("", "## Emits", "");
    sections.push("| Name | Description |");
    sections.push("| --- | --- |");
    for (const e of doc.emits) {
      const desc = e.description || "-";
      sections.push(`| ${e.name} | ${desc} |`);
    }
  }

  return sections.join("\n") + "\n";
}

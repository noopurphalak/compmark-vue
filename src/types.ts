export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default: string | undefined;
  description: string;
  deprecated?: string | boolean;
  since?: string;
  example?: string;
  see?: string;
}

export interface EmitDoc {
  name: string;
  description: string;
  payload?: string;
}

export interface SlotDoc {
  name: string;
  description: string;
  bindings: string[];
}

export interface ExposeDoc {
  name: string;
  type: string;
  description: string;
}

export interface ComposableDoc {
  name: string;
}

export interface ComponentDoc {
  name: string;
  description?: string;
  internal?: boolean;
  props: PropDoc[];
  emits: EmitDoc[];
  slots?: SlotDoc[];
  exposes?: ExposeDoc[];
  composables?: ComposableDoc[];
}

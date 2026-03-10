export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default: string | undefined;
  description: string;
}

export interface EmitDoc {
  name: string;
  description: string;
}

export interface ComponentDoc {
  name: string;
  props: PropDoc[];
  emits: EmitDoc[];
}

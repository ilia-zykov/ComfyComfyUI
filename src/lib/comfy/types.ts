export type InputConfig = {
  default?: unknown;
  min?: number;
  max?: number;
  step?: number;
  round?: number | false;
  multiline?: boolean;
  dynamicPrompts?: boolean;
  tooltip?: string;
  forceInput?: boolean;
  image_upload?: boolean;
  placeholder?: string;
  display?: string;
};

export type NodeInputSpec =
  | [string, InputConfig?]
  | [string[], InputConfig?]
  | [unknown[], InputConfig?];

export type ObjectInfoEntry = {
  input: {
    required?: Record<string, NodeInputSpec>;
    optional?: Record<string, NodeInputSpec>;
    hidden?: Record<string, NodeInputSpec>;
  };
  input_order?: {
    required?: string[];
    optional?: string[];
  };
  output: string[];
  output_is_list: boolean[];
  output_name: string[];
  name: string;
  display_name: string;
  description: string;
  python_module: string;
  category: string;
  output_node: boolean;
};

export type ObjectInfo = Record<string, ObjectInfoEntry>;

export type SystemStats = {
  system: {
    os: string;
    comfyui_version?: string;
    python_version?: string;
    pytorch_version?: string;
    ram_total?: number;
    ram_free?: number;
  };
  devices: Array<{
    name: string;
    type: string;
    index: number;
    vram_total?: number;
    vram_free?: number;
    torch_vram_total?: number;
    torch_vram_free?: number;
  }>;
};

export type QueueState = {
  queue_running: unknown[];
  queue_pending: unknown[];
};

export type HistoryEntry = {
  prompt: [number, string, Record<string, unknown>, Record<string, unknown>, string[]];
  outputs: Record<string, { images?: Array<{ filename: string; subfolder: string; type: string }> }>;
  status?: { status_str: string; completed: boolean; messages: unknown[] };
};

export type ComfyHistory = Record<string, HistoryEntry>;

export type WsMessage =
  | { type: 'status'; data: { status: { exec_info: { queue_remaining: number } }; sid?: string } }
  | { type: 'progress'; data: { value: number; max: number; node?: string; prompt_id?: string } }
  | { type: 'executing'; data: { node: string | null; prompt_id?: string } }
  | { type: 'executed'; data: { node: string; output: Record<string, unknown>; prompt_id?: string } }
  | { type: 'execution_start'; data: { prompt_id: string } }
  | { type: 'execution_success'; data: { prompt_id: string } }
  | { type: 'execution_error'; data: { prompt_id: string; node_id: string; node_type: string; exception_message: string; exception_type: string; traceback: string[] } }
  | { type: 'execution_cached'; data: { nodes: string[]; prompt_id: string } }
  | { type: string; data: unknown };

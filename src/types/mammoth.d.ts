declare module "mammoth" {
  interface MammothMessage {
    type: string;
    message: string;
  }

  interface MammothResult {
    value: string;
    messages: MammothMessage[];
  }

  export function convertToHtml(
    input: { arrayBuffer: ArrayBuffer },
    options?: Record<string, unknown>
  ): Promise<MammothResult>;

  export function extractRawText(
    input: { arrayBuffer: ArrayBuffer }
  ): Promise<MammothResult>;
}

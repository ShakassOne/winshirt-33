export type DesignElement = {
  type: "text" | "image";
  zIndex: number;
  text?: string;
  src?: string;
  font?: string;
  color?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
};

interface WinShirtTransform {
  scale: number;
  position: { x: number; y: number };
  rotation: number;
}

interface WinShirtDesign {
  designId: string;
  designUrl: string;
  transform: WinShirtTransform;
}

interface WinShirtText {
  content: string;
  font: string;
  color: string;
  transform: WinShirtTransform;
}

interface WinShirtJSON {
  frontDesign?: WinShirtDesign | null;
  backDesign?: WinShirtDesign | null;
  frontText?: WinShirtText | null;
  backText?: WinShirtText | null;
}

const BASE_SIZE = 200;

const convertSide = (
  design: WinShirtDesign | null | undefined,
  text: WinShirtText | null | undefined
): DesignElement[] => {
  const elements: DesignElement[] = [];
  let z = 1;

  if (design) {
    const scale = design.transform?.scale ?? 1;
    elements.push({
      type: "image",
      zIndex: z++,
      src: design.designUrl,
      x: design.transform?.position?.x ?? 0,
      y: design.transform?.position?.y ?? 0,
      width: BASE_SIZE * scale,
      height: BASE_SIZE * scale,
      rotation: design.transform?.rotation ?? 0,
    });
  }

  if (text) {
    elements.push({
      type: "text",
      zIndex: z++,
      text: text.content,
      font: text.font,
      color: text.color,
      x: text.transform?.position?.x ?? 0,
      y: text.transform?.position?.y ?? 0,
      rotation: text.transform?.rotation ?? 0,
    });
  }

  return elements;
};

export const winshirtToElements = (
  data: WinShirtJSON
): { front: DesignElement[]; back?: DesignElement[] } => {
  const front = convertSide(data.frontDesign, data.frontText);
  const back = convertSide(data.backDesign, data.backText);

  return back.length > 0 ? { front, back } : { front };
};

export default winshirtToElements;

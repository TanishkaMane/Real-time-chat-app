export const Positions = {
  topStart: "top-start",
  top: "top",
  topEnd: "top-end",
  rightStart: "right-start",
  right: "right",
  rightEnd: "right-end",
  bottomStart: "bottom-start",
  bottom: "bottom",
  bottomEnd: "bottom-end",
  leftStart: "left-start",
  left: "left",
  leftEnd: "left-end",
} as const;

export type Positions = (typeof Positions)[keyof typeof Positions];
export interface GameConfig {
  name: string;
  buttonMapping: ButtonMapping;
}

export type CreateGameConfigDTO = GameConfig;

export interface ButtonMapping {
  [key: string]: ButtonType;
}

export enum ButtonType {
  CROSS,
  CIRCLE,
  SQUARE,
  TRIANGLE,
  LEFT,
  UP,
  RIGHT,
  BOTTOM,
  R1,
  R2,
  R3,
  L1,
  L2,
  L3,
  OPTIONS,
  SHARE,
  PS_BUTTON
}
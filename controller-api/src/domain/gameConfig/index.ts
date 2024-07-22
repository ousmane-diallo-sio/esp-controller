export interface GameConfig {
  name: string;
  buttonMapping: ButtonMapping;
}

export type CreateGameConfigDTO = GameConfig;

export interface ButtonMapping {
  [key: string]: ButtonType;
}

export enum ButtonType {
  CROSS = "CROSS",
  CIRCLE = "CIRCLE",
  SQUARE = "SQUARE",
  TRIANGLE = "TRIANGLE",
  HAT_UP = "HAT_UP",
  HAT_DOWN = "HAT_DOWN",
  HAT_LEFT = "HAT_LEFT",
  HAT_RIGHT = "HAT_RIGHT",
  R1 = "R1",
  R2 = "R2",
  R3 = "R3",
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
  OPTIONS = "OPTIONS",
  SHARE = "SHARE",
  //PS_BUTTON = "PS_BUTTON",
}


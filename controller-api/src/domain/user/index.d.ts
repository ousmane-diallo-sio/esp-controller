import { NightTime } from "../nightTime";

export interface User {
  username: string;
  email: string;
  password?: string;
  salt?: string;
  gameConfigs: GameConfig[];
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  salt?: string;
}
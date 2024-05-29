import { JWTPayload } from "./auth";

// Adds the auth property from express-jwt to the Request object type
declare global {
  namespace Express {
    interface Request {
      auth?: JWTPayload;
    }
  }
}

export interface ServerResponse<T = undefined> {
  status: number
  data?: T
  messages?: ServerMessage[]
  jwt?: string
}

export interface ServerMessage {
  type: "info" | "success" | "warning" | "error"
  title?: string
  message: string
}
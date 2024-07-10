import jwt from "jsonwebtoken";
import { JWTPayloadDTO } from "../types/auth";
import EnvConfig from "./config/EnvConfig";
import crypto from "crypto";

export const generateToken = (payload: JWTPayloadDTO) => {
  return jwt.sign(payload, EnvConfig.JWT_SECRET, { expiresIn: "7d" });
};

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
};

export const comparePassword = (password: string, hash: string, salt: string) => {
  console.log('password', password);
  console.log('hash', hash);
  console.log('salt', salt);
  const _hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return _hash === hash;
};
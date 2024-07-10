import mongoose from "mongoose";
import { GameConfigSchema } from "../gameConfig/model";

export const UserSchema = new mongoose.Schema({
  email: {
    unique: true,
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
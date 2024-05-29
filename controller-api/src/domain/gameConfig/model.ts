import mongoose from "mongoose";

export const GameConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  buttonMapping: {
    type: Map,
    of: String, // Stringified Button enum
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const GameConfigModel = mongoose.model('GameConfig', GameConfigSchema);
export default GameConfigModel;
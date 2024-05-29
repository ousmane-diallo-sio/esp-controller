import mongoose, { Document, FilterQuery, ObjectId } from 'mongoose';
import { Repository, RepositoryReturnType } from '../../types/repository';
import UserValidator, { GameConfigValidator } from './validator';
import { generateToken, hashPassword } from '../../lib/auth';
import { CreateGameConfigDTO, GameConfig } from '.';
import { ServerMessage } from '../../types/response';
import UserModel from './model';
import { omit } from '../../lib/utils';
import GameConfigModel from './model';

class GameConfigRepository implements Repository<GameConfig> {

  async create(userId: string, data: CreateGameConfigDTO): Promise<RepositoryReturnType> {
    const validation = GameConfigValidator.safeParse(data);

    if (!validation.success) {
      const messages: ServerMessage[] = validation.error.issues.map((issue) => ({ type: "error", message: issue.message }));
      return { messages };
    }

    const gameConfig = await GameConfigModel.create({ ...data, userId });

    return { data: gameConfig };
  }

  async update(userId: string, _id: string, data: Partial<GameConfig>): Promise<RepositoryReturnType<typeof updatedGameConfig>> {
    const validation = GameConfigValidator.partial().safeParse(data);

    if (!validation.success) {
      const messages: ServerMessage[] = validation.error.issues.map((issue) => ({ type: "error", message: issue.message }));
      return { messages };
    }

    const updatedGameConfig = await GameConfigModel.findOneAndUpdate({ _id, userId }, data, { new: true });

    if (!updatedGameConfig) {
      return { messages: [{ type: "error", message: "Configuration non trouvée" }] };
    }

    return { data: updatedGameConfig };
  }

  async delete(userId: string, _id: string) {
    return await GameConfigModel.findOneAndDelete({ _id, userId });
  }

  async findAll(userId: string) {
    return await GameConfigModel.find({ userId: { $in: [userId, null] } });
  }


  async findById(userId: string, _id: string) {
    return await GameConfigModel.findOne({ _id, userId });
  }

}

export const gameConfigRepository = new GameConfigRepository();

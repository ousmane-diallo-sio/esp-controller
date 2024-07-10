import mongoose, { Document } from 'mongoose';
import { Repository, RepositoryReturnType } from '../../types/repository';
import UserValidator from './validator';
import { generateToken, hashPassword } from '../../lib/auth';
import { CreateUserDTO, User } from '.';
import { ServerMessage } from '../../types/response';
import UserModel from './model';
import { omit } from '../../lib/utils';

class UserRepository implements Repository<User, CreateUserDTO> {

  async create(data: CreateUserDTO): Promise<RepositoryReturnType<typeof out>> {
    const validation = UserValidator.safeParse(data);
    if (!validation.success) {
      const messages: ServerMessage[] = validation.error.issues.map((issue) => ({ type: "error", message: issue.message }));
      return { messages };
    }

    const hasDuplicate = await UserModel.findOne({ email: data.email });
    if (hasDuplicate) {
      return { messages: [{ type: "error", message: "Cet email est déjà utilisé"}] };
    }

    const { hash, salt } = hashPassword(data.password);
    data.password = hash;
    data.salt = salt;

    const user = await UserModel.create(data);

    const out = omit(user.toObject(), ["password", "salt"]);

    return { 
      data: out,
      jwt: generateToken({ id: user.id, email: user.email }) 
    };
  }

  async update(id: string, data: Partial<User>): Promise<RepositoryReturnType<typeof updatedUser>> {
    const validation = UserValidator.partial().safeParse(data);
    if (!validation.success) {
      const messages: ServerMessage[] = validation.error.issues.map((issue) => ({ type: "error", message: issue.message }));
      return { messages };
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password -salt");
    if (!updatedUser) {
      return { messages: [{ type: "error", message: "Utilisateur non trouvé" }] };
    }

    return {
      data: updatedUser,
      jwt: generateToken({ id, email: updatedUser.email })
    };
  }

  async delete(id: string) {
    return await UserModel.findByIdAndDelete(id);
  }

  async findAll() {
    return await UserModel.find().select("-password -salt");
  }

  async findById(id: string) {
    return await UserModel.findById(id).select("-password -salt");
  }

  async findByEmail(email: string, options?: { withSalt?: boolean, withPassword?: boolean }) {
    let attributesToSelect = "";
    if (!options?.withPassword) {
      attributesToSelect = "-password ";
    }
    if (!options?.withSalt) {
      attributesToSelect += "-salt ";
    }
    return await UserModel.findOne({ email }).select(attributesToSelect);
  }
}

export const userRepository = new UserRepository();

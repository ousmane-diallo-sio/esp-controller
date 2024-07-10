import { ObjectId } from "mongodb";
import { ServerMessage } from "./response";

export interface Repository<T> {
  create: ((...args: any[]) => Promise<RepositoryReturnType | null>);
  update: (...args: any[]) => Promise<RepositoryReturnType | null>;
  delete: (...args: any[]) => Promise<any>;
  findAll: (...args: any[]) => Promise<any[]>;
  findById: (...args: any[]) => Promise<any | null>;
}


type RepositoryReturnTypeWithData<T> = { data: T | null | undefined, messages?: undefined }
type RepositoryReturnTypeWithError = { data?: null | undefined, messages: ServerMessage[] }

export type RepositoryReturnType<T = any> = (RepositoryReturnTypeWithData<T> | RepositoryReturnTypeWithError) & {
  jwt?: string;
};

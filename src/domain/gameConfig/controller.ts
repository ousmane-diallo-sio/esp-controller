import { Request, RequestHandler, Response, Router } from "express";
import { formatResponse } from "../../lib/utils/response";
import { jwt } from "../../lib/middlewares";
import { z } from "zod";
import { comparePassword, generateToken } from "../../lib/auth";
import { omit } from "../../lib/utils";
import { gameConfigRepository } from "./repository";
import { CreateGameConfigDTO, GameConfig } from ".";

const gameConfigController = Router();

const getOneById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.auth!.id;

  try {
    const user = await gameConfigRepository.findById(reqUserId, id);

    if (!user) {
      return formatResponse(res, {
        status: 404,
        messages: [{ type: "error", message: "Utilisateur non trouvé" }],
      });
    }

    const gameConfig = await gameConfigRepository.findById(reqUserId, id);

    if (!gameConfig) {
      return formatResponse(res, {
        status: 404,
        messages: [{ type: "error", message: "Configuration de jeu non trouvée" }],
      });
    }

    return formatResponse(res, { status: 200, data: gameConfig });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la récupération de la configuration" }],
    });
  }
};

const getAll: RequestHandler = async (req, res) => {
  const reqUserId = req.auth!.id;

  try {
    const gameConfigs = await gameConfigRepository.findAll(reqUserId);

    return formatResponse(res, { status: 200, data: gameConfigs });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la récupération des configurations" }],
    });
  }
};

const createOne: RequestHandler = async (req, res) => {
  const reqUserId = req.auth!.id;
  const gameConfig: CreateGameConfigDTO = req.body;

  try {
    const { data, messages, jwt } = await gameConfigRepository.create(reqUserId, gameConfig);
    
    return formatResponse(res, { status: 200, data: data, messages, jwt });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la création de votre compte" }],
    });
  }
};

const updateOne: RequestHandler = async (req, res) => {
  const reqUserId = req.auth!.id;
  const gameConfigDTO: Partial<GameConfig> = req.body;
  const { id } = req.params;

  try {
    const { data, messages, jwt } = await gameConfigRepository.update(reqUserId, id, gameConfigDTO);

    return formatResponse(res, { status: 200, data, messages, jwt });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la mise à jour de votre compte" }],
    });
  }
}

const deleteOne: RequestHandler = async (req, res) => {
  const reqUserId = req.auth!.id;
  const { id } = req.params;

  try {
    await gameConfigRepository.delete(reqUserId, id);

    return formatResponse(res, { status: 200, messages: [{ type: "success", message: "Configuration de jeu supprimée" }] });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la suppression de la configuration de jeu" }],
    });
  }
};

gameConfigController.post("/", jwt, createOne);
gameConfigController.get("/:id", jwt, getOneById);
gameConfigController.get("/", jwt, getAll);
gameConfigController.patch("/:id", jwt, updateOne);
gameConfigController.delete("/:id", jwt, deleteOne);

export default gameConfigController;
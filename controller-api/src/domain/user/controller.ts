import { Request, RequestHandler, Response, Router } from "express";
import { userRepository } from "./repository";
import { formatResponse } from "../../lib/utils/response";
import { jwt } from "../../lib/middlewares";
import { CreateUserDTO, User } from ".";
import { z } from "zod";
import { comparePassword, generateToken } from "../../lib/auth";
import { omit } from "../../lib/utils";

const userController = Router();

const getOneById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.auth!.id;
  console.debug(reqUserId);
  try {
    if (id !== reqUserId) {
      return formatResponse(res, {
        status: 403,
        messages: [{ type: "error", message: "Vous n'êtes pas autorisé à accéder à cette ressource" }],
      });
    }

    const user = await userRepository.findById(id);
    if (!user) {
      return formatResponse(res, {
        status: 404,
        messages: [{ type: "error", message: "Utilisateur non trouvé" }],
      });
    }
    return formatResponse(res, { status: 200, data: user });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la récupération de l'utilisateur" }],
    });
  }
};

const getAll: RequestHandler = async (req, res) => {
  try {
    const users = await userRepository.findAll();
    return formatResponse(res, { status: 200, data: users });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la récupération des utilisateurs" }],
    });
  }
};

const createOne: RequestHandler = async (req, res) => {
  console.debug("createOne", req.body);
  const user: CreateUserDTO = req.body;

  try {
    const { data, messages, jwt } = await userRepository.create(user);
    
    return formatResponse(res, {
      status: 200,
      data: data,
      messages,
      jwt
    });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la création de votre compte" }],
    });
  }
};

const updateOne: RequestHandler = async (req, res) => {
  const userDTO: Partial<User> = req.body;
  const { id } = req.auth!;

  try {
    const { data, messages, jwt } = await userRepository.update(id, userDTO);
    return formatResponse(res, { status: 200, data, messages, jwt });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la mise à jour de votre compte" }],
    });
  }
}

const login: RequestHandler = async (req, res) => {
  const validationSchema = z.object({ 
    email: z.string().email("Adresse email invalide"), 
    password: z.string().min(1, "Vous n'avez pas renseigné votre mot de passe") 
  });
  const validation = validationSchema.safeParse(req.body);
  if (!validation.success) {
    return formatResponse(res, {
      status: 400,
      messages: validation.error.issues.map((issue) => ({ type: "error", message: issue.message })),
    });
  }

  const { email, password } = req.body as z.infer<typeof validationSchema>;

  try {
    const selectedUser = await userRepository.findByEmail(email, { withSalt: true, withPassword: true });
    if (!selectedUser) {
      return formatResponse(res, {
        status: 404,
        messages: [{ type: "error", message: "Utilisateur non trouvé" }],
      });
    }

    if (!comparePassword(password, selectedUser.password, selectedUser.salt)) {
      return formatResponse(res, {
        status: 401,
        messages: [{ type: "error", message: "Mot de passe incorrect" }],
      });
    }

    const userData = omit(selectedUser.toObject(), ["password", "salt"]);
    return formatResponse(res, {
      status: 200,
      data: userData,
      jwt: generateToken({ id: userData._id.toString(), email: userData.email }),
    });
  } catch (error) {
    console.error(error);
    return formatResponse(res, {
      status: 400,
      messages: [{ type: "error", message: "Une erreur est survenue lors de la connexion" }],
    });
  }
};

userController.post("/", createOne);
userController.patch("/", jwt, updateOne);
userController.get("/:id", jwt, getOneById);
userController.post("/login", login);
// userController.get("/", jwt, getAll);

export default userController;
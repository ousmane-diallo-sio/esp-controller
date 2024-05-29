import { z } from 'zod';

export const PasswordValidatior = z.string()
  .min(8, { message: "Le mot de passe doit contenir au moins {#limit} caractères" })
  .max(20, { message: "Le mot de passe ne doit pas dépasser {#limit} caractères" });

const UserValidator = z.strictObject({
  email: z.string()
    .email({ message: "L'adresse email est invalide" })
    .min(1, { message: "L'adresse email doit contenir au moins {#limit} caractères" }),
  username: z.string()
    .min(2, { message: "Le nom d'utilisateur doit contenir au moins {#limit} caractères" })
    .max(50, { message: "Le nom d'utilisateur ne doit pas dépasser {#limit} caractères" }),
  password: PasswordValidatior,
});


export default UserValidator;
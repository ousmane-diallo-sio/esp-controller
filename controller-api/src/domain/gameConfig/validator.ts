import { z } from 'zod';
import { ButtonType } from '.';

export const GameConfigValidator = z.strictObject({
  name: z.string(),
  buttonMapping: z.record(z.nativeEnum(ButtonType))
});

export default GameConfigValidator;
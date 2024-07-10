import { Response } from "express";
import { ServerResponse } from "../../types/response";

export const formatResponse = <T>(res: Response, resData: ServerResponse<T>) => {
  const { status, data, messages, jwt } = resData;

  return res.status(status).json({
    status,
    data,
    messages,
    jwt,
  });
}
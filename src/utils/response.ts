import { Response } from 'express';

export const responseData = (
  res: Response,
  message: string,
  data: any,
  statusCode: number,
) => {
  return res.status(statusCode).json({
    message,
    content: data,
    date: new Date(),
  });
};

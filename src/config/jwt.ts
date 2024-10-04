import * as jwt from 'jsonwebtoken';
import { responseData } from 'src/utils/response';

export const tokenMajors = {
  //   createToken: (data) => {
  //     const token = jwt.sign({ data }, process.env.TOKEN_SECRET_KEY, {
  //       algorithm: "HS256",
  //       expiresIn: "5m",
  //     });

  //     return token;
  //   },

  //   createRefToken: (data: any) => {
  //     const token = jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET_KEY, {
  //       algorithm: 'HS256',
  //       expiresIn: '7d',
  //     });

  //     return token;
  //   },
  decodeToken: (token: any): any => {
    return jwt.decode(token);
  },

  //   checkToken: (token: any) => {
  //     return jwt.verify(token, process.env.SECRET_KEY_TOKEN, (error, decode) => {
  //       return error;
  //     });
  //   },
  //   checkRefToken: (token: any) => {
  //     return jwt.verify(
  //       token,
  //       process.env.SECRET_KEY_REF_TOKEN,
  //       (error: any, decode: any) => {
  //         return error;
  //       },
  //     );
  //   },

  //   verifyToken: (req: any, res: any, next: any) => {
  //     let { authorization } = req.headers;
  //     const token = authorization.replace('Bearer ', '');
  //     const checkedToken: any = tokenMajors.checkToken(token);
  //     if (!checkedToken) {
  //       next();
  //     } else {
  //       return responseData(
  //         res,
  //         'Unauthorized - Bạn Không có quyền truy cập',
  //         checkedToken.name,
  //         401,
  //       );
  //     }
  //   },
};

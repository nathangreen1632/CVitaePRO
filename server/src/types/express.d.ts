import { JwtPayload } from "jsonwebtoken";
import { File } from "multer";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload; // Fix `req.user` error
    file?: File; // Fix `req.file` error
  }
}

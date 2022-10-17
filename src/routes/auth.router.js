import { Router } from "express";
import { postSignIn, postSignUp } from "../controllers/auth.controller.js";

const authRouter = Router();

// registro
authRouter.post('/signup', postSignUp);
// login
authRouter.post('/signin', postSignIn);

export default authRouter;
import { Router } from "express";
import { getUser } from "../controllers/users.controller.js";
import { hasUser } from "../middleware/auth.middleware.js";

const usersRouter = Router();

usersRouter.use(hasUser);

usersRouter.get('/users/me', getUser);

export default usersRouter;
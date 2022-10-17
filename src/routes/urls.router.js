import { Router } from "express";
import { deleteShorten, getSpecificShorten, postShorten, redirectShorten } from "../controllers/urls.controller.js";
import { hasUser } from "../middleware/auth.middleware.js";

const urlsRouter = Router();

urlsRouter.get('/urls/:id', getSpecificShorten);
urlsRouter.get('/urls/open/:shortUrl', redirectShorten);

urlsRouter.use(hasUser);

urlsRouter.post('/urls/shorten', postShorten);
urlsRouter.delete('/urls/:id', deleteShorten);

export default urlsRouter;
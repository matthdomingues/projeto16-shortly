import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import authRouter from './routes/auth.router.js';
import urlsRouter from './routes/urls.router.js';
import usersRouter from './routes/users.router.js';
import rankingRouter from './routes/ranking.router.js';

const server = express();
dotenv.config();
server.use(express.json());
server.use(cors());

// auth
server.use(authRouter);
// urls
server.use(urlsRouter);
// users
server.use(usersRouter);
// ranking
server.use(rankingRouter);

server.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});

// server.listen(4000, () => {
//     console.log('Server listening on port 4000');
// });
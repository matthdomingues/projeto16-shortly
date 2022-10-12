import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

// routers import - LEMBRA DO .JS NO FINAL //
import authRouter from './routes/auth.router.js';
import urlsRouter from './routes/urls.router.js';

const server = express();
dotenv.config();
server.use(express.json());
server.use(cors());

// // auth
server.use(authRouter);
// // urls
server.use(urlsRouter);
// // users
// server.use();
// // ranking
// server.use();

server.listen(4000, () => {
    console.log('Server listening on port 4000');
});
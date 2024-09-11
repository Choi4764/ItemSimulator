import express from 'express';
import cookieParser from 'cookie-parser';
import AuthMiddleware from '../middleware/auth.middleware.js';
import AccountsRouter from '../main/routes/accounts.router.js';
import CharactersRouter from '../main/routes/characters.router.js';
import ItemsRouter from '../main/routes/items.router.js'

const app = express();
const PORT = 3306;

app.use(AuthMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use('/api', [AccountsRouter, CharactersRouter, ItemsRouter]);

app.set('port', PORT);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});

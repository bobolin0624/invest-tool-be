import Koa from 'koa';
import Router from 'koa-router';
import 'dotenv/config';
import bodyParser from 'koa-bodyparser';
import investmentRoutes from './routes/investments';
import { errorHandler } from './middleware/errorHandler';

const app = new Koa();
const router = new Router();

router.use(investmentRoutes.routes());

app.use(bodyParser());
// middleware for error handler
app.use(errorHandler);

router.get('/', async (ctx) => {
	ctx.body = 'Hello TypeScript + Koa!';
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

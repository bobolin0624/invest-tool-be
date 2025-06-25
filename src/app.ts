import Koa from 'koa';
import Router from 'koa-router';
import 'dotenv/config';
import bodyParser from 'koa-bodyparser';
import investmentRoutes from './routes/investments';
import dividendRoutes from './routes/dividends';
import { errorHandler } from './middleware/errorHandler';
import { koaSwagger } from 'koa2-swagger-ui';
import { swaggerSpec } from './swagger';

const app = new Koa();
const router = new Router();

router.use(investmentRoutes.routes());
router.use(dividendRoutes.routes());

app.use(bodyParser());
// middleware for error handler
app.use(errorHandler);

router.get('/', async (ctx) => {
	ctx.body = 'Hello TypeScript + Koa!';
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(
	koaSwagger({
		routePrefix: '/explorer',
		swaggerOptions: {
			spec: swaggerSpec as Record<string, unknown>,
		},
	})
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

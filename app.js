const Koa = require('koa');
const app = new Koa();

const port = process.env.port || 3000;

app.use(async ctx => {
	ctx.body = 'Hello koa';
});

app.listen(port, () => {
	console.log(`App is running on ${port}`);
});

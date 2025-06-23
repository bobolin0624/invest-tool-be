import { Context, Next } from "koa";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error: any) {
    console.error(`Caught Error: ${error}`)
    ctx.status = error.status || 500;
     ctx.body = {
      status: 'error',
      message: error.message || 'Internal Server Error',
    };
  }
}
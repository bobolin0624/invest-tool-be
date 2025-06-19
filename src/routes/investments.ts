import Router from "koa-router";
import { db } from "../firebase";

const router = new Router();

router.get('/investments', async (ctx) => {
  console.log('get investments');
  const snapshot = await db.collection('investments').get();
  const investments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  ctx.body = { 
    status: 'ok',
    data: investments
  };
})

export default router;
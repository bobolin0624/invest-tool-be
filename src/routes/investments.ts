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

router.post('/investments', async (ctx) => {
  console.log('create investments');
  // fields: userId, name, cost, type, value, shares
  const createData = ctx.request.body as Object;
  const newInvestment = {
    ...createData,
    createdAt: new Date().toISOString(),
  }
  const createdResult = await db.collection('investments').add(newInvestment);
  ctx.body = {
    status: 'ok',
    data: {
      id: createdResult.id,
      ...newInvestment,
    }
  }
})

router.patch('/investments/:id', async (ctx) => {
  console.log('upload investments');
  const investmentId = ctx.params.id
  db.collection("users").doc(investmentId).update({foo: "bar"});
})

export default router;
import Router from "koa-router";
import { db } from "../firebase";

const router = new Router();

router.get('/investments/:id/dividends',
  async (ctx) => {
    try {
      const investmentId = ctx.params.id;
      const dividendsRef = db.collection('dividends');
      const snapshot = await dividendsRef.where('investmentId', '==', investmentId).get();
      if (snapshot.empty) {
        return ctx.body = {
          status: 'ok',
          message: 'No matching documents',
        };
      }
      const dividendsOfInvestment = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      ctx.body = {
        status: 'ok',
        data: dividendsOfInvestment,
      };
    } catch (error: any) {
      console.error(error.stack);
      ctx.throw(500, 'Failed to get dividends');
    }
  }
)

router.post('/investments/:id/dividends',
  async (ctx) => {
    try {
      console.log('create dividends');
      // fields: investmentId, value, date
      const investmentId = ctx.params.id;
      const createData = ctx.request.body as Object;
      const newDividend = {
        ...createData,
        investmentId,
        createdAt: new Date().toISOString(),
      }
      const createdResult = await db.collection('dividends').add(newDividend);
      ctx.body = {
        status: 'ok',
        data: {
          id: createdResult.id,
          ...newDividend,
        }
      }
    } catch (error: any) {
      console.error(error.stack);
      ctx.throw(500, 'Failed to create dividend');
    }
  }
)

router.patch('/dividends/:id', async (ctx) => {
  try {
    console.log('upload dividends');
    const dividendsId = ctx.params.id;
    const updateData = ctx.request.body as Object;
    const patchDividend = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    db.collection('dividends').doc(dividendsId).update(patchDividend);
    ctx.body = {
      status: 'ok',
    }
  } catch (error: any) {
    console.error(error.stack);
    ctx.throw(500, 'Failed to update dividend');
  }
})

router.delete('/dividends/:id', async (ctx) => {
  try {
    console.log('delete dividend');
    const dividendId = ctx.params.id;
    db.collection('dividends').doc(dividendId).delete();
    ctx.body = {
      status: 'ok',
    };
  } catch (error: any) {
    console.error(error.stack);
    ctx.throw(500, 'Failed to delete dividend');
  }
})

export default router;
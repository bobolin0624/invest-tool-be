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

export default router;
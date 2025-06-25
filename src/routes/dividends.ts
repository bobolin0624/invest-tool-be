import Router from "koa-router";
import { db } from "../firebase";

const router = new Router();

/**
 * @swagger
 * /investments/{id}/dividends:
 *  get:
 *    summary: Get all dividends of investment
 *    tags: 
 *    - Dividends
 *    parameters:
 *      - in: path
 *        name: id
 *        description: investment id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: 成功取得歷史股利
 */
router.get('/investments/:id/dividends',
  async (ctx) => {
    try {
      console.log('get dividends');
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

/**
 * @swagger
 * /investments/{id}/dividends:
 *  post:
 *    summary: Create a new dividend
 *    tags: 
 *    - Dividends
 *    parameters:
 *      - in: path
 *        name: id
 *        description: investment id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - date
 *              - value
 *            properties:
 *              date:
 *                type: Timestamp (UTC)
 *                example: "2025/6/12T16:00:00Z"
 *              value:
 *                type: number
 *                example: 100000
 *    responses:
 *      200:
 *        description: 成功新增一筆股利紀錄
 */
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

/**
 * @swagger
 * /dividends/{id}:
 *  patch:
 *    summary: Update dividend by id
 *    tags: 
 *    - Dividends
 *    parameters:
 *      - in: path
 *        name: id
 *        description: dividend id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
  *              date:
 *                type: Timestamp (UTC)
 *                example: "2025/6/12T16:00:00Z"
 *              value:
 *                type: number
 *                example: 100000
 *    responses:
 *      200:
 *        description: 成功編輯股利紀錄
 */
router.patch('/dividends/:id', async (ctx) => {
  try {
    console.log('upload dividends');
    const dividendsId = ctx.params.id;
    const updateData = ctx.request.body as Object;
    const patchDividend = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    await db.collection('dividends').doc(dividendsId).update(patchDividend);
    ctx.body = {
      status: 'ok',
    }
  } catch (error: any) {
    console.error(error.stack);
    ctx.throw(500, 'Failed to update dividend');
  }
})

/**
 * @swagger
 * /dividends/{id}:
 *  delete:
 *    summary: Delete dividend by id
 *    tags: 
 *    - Dividends
 *    parameters:
 *      - in: path
 *        name: id
 *        description: dividend id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: 成功刪除股利紀錄
 */
router.delete('/dividends/:id', async (ctx) => {
  try {
    console.log('delete dividend');
    const dividendId = ctx.params.id;
    await db.collection('dividends').doc(dividendId).delete();
    ctx.body = {
      status: 'ok',
    };
  } catch (error: any) {
    console.error(error.stack);
    ctx.throw(500, 'Failed to delete dividend');
  }
})

export default router;
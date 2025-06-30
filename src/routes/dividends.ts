import Router from "koa-router";
import { db } from "../firestore/firebase";
import { dividendRepository } from "../firestore/dividend.repository";
import { investmentRepository } from "../firestore/investment.repository";

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
      // TODO add investment info
      const investmentId = ctx.params.id;
      const investmentInfo = await investmentRepository.getInvestmentById(investmentId);
      const dividendsOfInvestment = await dividendRepository.getActiveDividendsByInvestId(investmentId);
      ctx.body = {
        status: 'ok',
        data: {
          investmentInfo,
          dividends: dividendsOfInvestment,
        },
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
      // fields: investmentId, value, date
      const investmentId = ctx.params.id;
      const createData = ctx.request.body as Object;
      const newDividend = {
        ...createData,
        deletedAt: null,
        investmentId,
        createdAt: new Date().toISOString(),
      }
      const createdResult = await dividendRepository.createDividend(newDividend);

      ctx.body = {
        status: 'ok',
        data: {
          id: createdResult!.id,
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
    const dividendId = ctx.params.id;
    const updateData = ctx.request.body as Object;
    const patchDividend = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    await dividendRepository.updateDividend(dividendId, patchDividend);
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
    const dividendId = ctx.params.id;
    await dividendRepository.softDeleteDividendById(dividendId);
    ctx.body = {
      status: 'ok',
    };
  } catch (error: any) {
    console.error(error.stack);
    ctx.throw(500, 'Failed to delete dividend');
  }
})

export default router;
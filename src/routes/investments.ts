import Router from "koa-router";
import { db } from "../firestore/firebase";
import { investmentRepository } from "../firestore/investment.repository";
import { dividendRepository } from "../firestore/dividend.repository";

const router = new Router();

/**
 * @swagger
 * /investments:
 *  get:
 *    summary: Get all investments
 *    tags: 
 *    - Investments
 *    responses:
 *      200:
 *        description: 成功取得投資清單
 */
router.get('/investments', async (ctx) => {
  try {
    const investments = await investmentRepository.getAllActiveInvestment();
    ctx.body = {
      status: 'ok',
      data: investments,
    };
  } catch (error: any) {
    console.error(error.stack);
    ctx.throw(500, 'Failed to fetch investments');
  }
})

/**
 * @swagger
 * /investments:
 *  post:
 *    summary: Create a new investment
 *    tags: 
 *    - Investments
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - cost
 *              - type
 *              - value
 *              - shares
 *            properties:
 *              name:
 *                type: string
 *                example: "0050"
 *              cost:
 *                type: number
 *                example: 100000
 *              type:
 *                type: string
 *                example: "ETF"
 *              value:
 *                type: number
 *                example: 120000
 *              shares:
 *                type: number
 *                example: 100
 *    responses:
 *      200:
 *        description: 成功新增投資項目
 */
router.post('/investments', async (ctx) => {
  try {
    // fields: userId, name, cost, type, value, shares
    const createData = ctx.request.body as Object;
    const newInvestment = {
      ...createData,
      createdAt: new Date().toISOString(),
      deletedAt: null,
    }
    const createdResult = await investmentRepository.createInvestment(newInvestment);
    if (createdResult) {
      ctx.body = {
        status: 'ok',
        data: {
          id: createdResult.id,
          ...newInvestment,
        }
      }
    }
  } catch (error: any) {
    console.error(error.stack);
    ctx.throw(500, 'Failed to create investment');
  }
})

/**
 * @swagger
 * /investments/{id}:
 *  patch:
 *    summary: Update investment by id
 *    tags: 
 *    - Investments
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
 *            properties:
 *              name:
 *                type: string
 *                example: "0050"
 *              cost:
 *                type: number
 *                example: 100000
 *              type:
 *                type: string
 *                example: "ETF"
 *              value:
 *                type: number
 *                example: 120000
 *              shares:
 *                type: number
 *                example: 100
 *    responses:
 *      200:
 *        description: 成功編輯投資項目
 */
router.patch('/investments/:id', async (ctx) => {
  try {
    const investmentId = ctx.params.id
    const updateData = ctx.request.body as Object;
    const patchInvestment = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    await investmentRepository.patchInvestment(investmentId, patchInvestment);

    ctx.body = {
      status: 'ok',
    }
  } catch (error: any) {
    console.error(error.stack);
    ctx.throw(500, 'Failed to update investment');
  }
})

/**
 * @swagger
 * /investments/{id}:
 *  patch:
 *    summary: Delete investment by id
 *    tags: 
 *    - Investments
 *    parameters:
 *      - in: path
 *        name: id
 *        description: investment id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: 成功刪除投資項目
 */
router.delete('/investments/:id', async (ctx) => {
  try {
    const investmentId = ctx.params.id;
    await investmentRepository.softDeleteInvestment(investmentId);
    await dividendRepository.softDeleteDividendsByInvestId(investmentId);
    ctx.body = {
      status: 'ok',
    };
  } catch (error: any) {
    console.error(error.stack);
    ctx.throw(500, 'Failed to delete investment');
  }
})

export default router;
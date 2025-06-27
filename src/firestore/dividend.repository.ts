import { getFirestore } from 'firebase-admin/firestore';
import { db } from "./firebase";

const dividendCollection = db.collection('dividends');

export const dividendRepository = {
  getActiveDividendsByInvestId: async (investmentId: string) => {
    try {
      const snapshot = await dividendCollection
        .where('deletedAt', '==', null)
        .where('investmentId', '==', investmentId)
        .get();
      const dividends = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return dividends;
    } catch (error: any) {
      console.error(`getActiveDividendsByInvestId error: ${error.stack}`);
      throw new Error('Failed to fetch dividends');
    }
  },
  createDividend: async (createData: any) => {
    try {
      const createdResult = await dividendCollection.add(createData);
      return createdResult
    } catch (error: any) {
      console.error(`createDividend error: ${error.stack}`);
      throw new Error('Failed to create dividend');
    }
  },
  updateDividend: async (dividendId: string, updateData: any) => {
    try {
      await dividendCollection.doc(dividendId).update(updateData);
      return;
    } catch (error: any) {
      console.error(`updateDividend error: ${error.stack}`);
      throw new Error('Failed to update dividend');
    }
  },
  softDeleteDividendById: async (dividendId: string) => {
    try {
      await dividendCollection.doc(dividendId).update({
        deletedAt: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error(`softDeleteDividendById error: ${error.stack}`);
      throw new Error('Failed to delete dividend');
    }
  },
  softDeleteDividendsByInvestId: async (investmentId: string) => {
    try {
      const dividendSnapshot = await dividendCollection
        .where('investmentId', '==', investmentId)
        .get();
      const firestore = getFirestore();
      const batch = firestore.batch();
      dividendSnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          deletedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      return;
    } catch (error: any) {
      console.error(`softDeleteDividendsByInvestId error: ${error.stack}`);
      throw new Error('Failed to delete dividends');
    }
  }
}

import { getFirestore } from 'firebase-admin/firestore';
import { db } from "./firebase";

const dividendCollection = db.collection('dividends');

export const dividendRepository = {
  getDividendsByInvestId: async (investmentId: string) => {
    try {

    } catch (error: any) {
      console.error(`getDividendsByInvestId error: ${error.stack}`);
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
    }
  }
}

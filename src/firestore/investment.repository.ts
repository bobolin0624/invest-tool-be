import { db } from "../firestore/firebase";

const investCollection = db.collection('investments');

export const investmentRepository = {
  getAllActiveInvestment: async () => {
    try {
      const snapshot = await investCollection
        .where('deletedAt', '==', null)
        .get();
      const investments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return investments;
    } catch (error: any) {
      console.error(`getAllActiveInvestment error: ${error.stack}`)
    }
  }
}
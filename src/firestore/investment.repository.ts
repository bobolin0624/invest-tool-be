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
      console.error(`getAllActiveInvestment error: ${error.stack}`);
      throw new Error('Failed to fetch investments');
    }
  },
  getInvestmentById: async (investmentId: string) => {
    try {
      const investmentSnapshot = await investCollection.doc(investmentId).get();
      const investment = {
        id: investmentSnapshot.id,
        ...investmentSnapshot.data(),
      }
      return investment;
    } catch (error: any) {
      console.error(`getInvestmentById error: ${error.stack}`);
      throw new Error('Failed to fetch investment');
    }
  },
  createInvestment: async (createData: any) => {
    try {
      const createdResult = await investCollection.add(createData);
      return createdResult;
    } catch (error: any) {
      console.error(`createInvestment error: ${error.stack}`);
      throw new Error('Failed to create investment');
    }
  },
  patchInvestment: async (investmentId: string, updateData: any) => {
    try {
      await investCollection.doc(investmentId).update(updateData);
      return
    } catch (error: any) {
      console.error(`patchInvestment error: ${error.stack}`);
      throw new Error('Failed to update investment');
    }
  },
  softDeleteInvestment: async (investmentId: string) => {
    try {
      await investCollection.doc(investmentId).update({
        deletedAt: new Date().toISOString(),
      });
      return;
    } catch (error: any) {
      console.error(`softDeleteInvestment error: ${error.stack}`);
      throw new Error('Failed to delete investment');
    }
  }
}
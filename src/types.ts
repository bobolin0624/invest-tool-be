export interface Dividend {
  id?: string;
  investmentId: string;
  value: number;
  date: string;
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string; 
}

export interface Investment {
  id?: string;
  // todo need user in the future
  name: string;
  cost: number;
  type: string;
  value: number;
  shares: number;
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction, TransactionType, TransactionStatus } from '@fintomonie/shared';

interface TransactionsState {
  transactions: Transaction[];
  totalTransactions: number;
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
}

const initialState: TransactionsState = {
  transactions: [],
  totalTransactions: 0,
  isLoading: false,
  error: null,
  page: 1,
  limit: 20,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async ({ page, limit }: { page: number; limit: number }) => {
    // Mock data for demo
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockTransactions: Transaction[] = Array.from({ length: limit }, (_, index) => ({
      id: `txn-${page}-${index}`,
      reference: `TXN_${Date.now()}_${index}`,
      amount: Math.floor(Math.random() * 100000) + 1000,
      currency: 'NGN',
      type: [TransactionType.CREDIT, TransactionType.DEBIT, TransactionType.TRANSFER][Math.floor(Math.random() * 3)],
      status: [TransactionStatus.SUCCESS, TransactionStatus.PENDING, TransactionStatus.FAILED][Math.floor(Math.random() * 3)],
      description: `Transaction ${index + 1}`,
      fromWalletId: Math.random() > 0.5 ? `wallet-${index}` : undefined,
      toWalletId: Math.random() > 0.5 ? `wallet-${index + 1}` : undefined,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    }));

    return {
      transactions: mockTransactions,
      totalTransactions: 89654,
      page,
      limit,
    };
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.totalTransactions = action.payload.totalTransactions;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
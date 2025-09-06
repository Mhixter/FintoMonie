import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '@fintomonie/shared';
import { apiClient } from '../api/client';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
  pagination: null,
};

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async ({ page = 1, limit = 50 }: { page?: number; limit?: number } = {}) => {
    const response = await apiClient.get(`/wallet/transactions?page=${page}&limit=${limit}`);
    return response.data;
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
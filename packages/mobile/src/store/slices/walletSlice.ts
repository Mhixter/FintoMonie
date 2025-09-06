import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Wallet } from '@fintomonie/shared';
import { apiClient } from '../api/client';

interface WalletState {
  wallet: Wallet | null;
  balance: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  wallet: null,
  balance: 0,
  isLoading: false,
  error: null,
};

export const getWalletBalance = createAsyncThunk(
  'wallet/getBalance',
  async () => {
    const response = await apiClient.get('/wallet/balance');
    return response.data;
  }
);

export const deposit = createAsyncThunk(
  'wallet/deposit',
  async ({ amount, description }: { amount: number; description: string }) => {
    const response = await apiClient.post('/wallet/deposit', { amount, description });
    return response.data;
  }
);

export const withdraw = createAsyncThunk(
  'wallet/withdraw',
  async ({ amount, description }: { amount: number; description: string }) => {
    const response = await apiClient.post('/wallet/withdraw', { amount, description });
    return response.data;
  }
);

export const transfer = createAsyncThunk(
  'wallet/transfer',
  async ({ 
    amount, 
    recipientAccountNumber, 
    description 
  }: { 
    amount: number; 
    recipientAccountNumber: string; 
    description: string; 
  }) => {
    const response = await apiClient.post('/wallet/transfer', {
      amount,
      recipientAccountNumber,
      description
    });
    return response.data;
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWalletBalance.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
        state.isLoading = false;
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.balance = action.payload.newBalance;
        state.isLoading = false;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.balance = action.payload.newBalance;
        state.isLoading = false;
      })
      .addCase(transfer.fulfilled, (state, action) => {
        state.balance = action.payload.newBalance;
        state.isLoading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'An error occurred';
        }
      );
  },
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer;
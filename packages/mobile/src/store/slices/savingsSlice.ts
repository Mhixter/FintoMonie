import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SavingsGoal } from '@fintomonie/shared';
import { apiClient } from '../api/client';

interface SavingsState {
  goals: SavingsGoal[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SavingsState = {
  goals: [],
  isLoading: false,
  error: null,
};

export const getSavingsGoals = createAsyncThunk(
  'savings/getGoals',
  async () => {
    const response = await apiClient.get('/savings/goals');
    return response.data;
  }
);

export const createSavingsGoal = createAsyncThunk(
  'savings/createGoal',
  async (goalData: {
    title: string;
    targetAmount: number;
    deadline: string;
  }) => {
    const response = await apiClient.post('/savings/goals', goalData);
    return response.data;
  }
);

export const fundGoal = createAsyncThunk(
  'savings/fundGoal',
  async ({ goalId, amount }: { goalId: string; amount: number }) => {
    const response = await apiClient.post(`/savings/goals/${goalId}/fund`, { amount });
    return response.data;
  }
);

const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSavingsGoals.fulfilled, (state, action) => {
        state.goals = action.payload;
        state.isLoading = false;
      })
      .addCase(createSavingsGoal.fulfilled, (state, action) => {
        state.goals.unshift(action.payload.goal);
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

export const { clearError } = savingsSlice.actions;
export default savingsSlice.reducer;
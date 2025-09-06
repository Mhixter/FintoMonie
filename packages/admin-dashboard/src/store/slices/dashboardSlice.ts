import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalWalletBalance: number;
  totalTransactionVolume: number;
  pendingLoans: number;
  activeUsers: number;
  monthlyGrowth: number;
  transactionGrowth: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    // Mock data for demo - in real app, this would call the API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    return {
      totalUsers: 15420,
      totalTransactions: 89654,
      totalWalletBalance: 125000000,
      totalTransactionVolume: 2500000000,
      pendingLoans: 47,
      activeUsers: 12890,
      monthlyGrowth: 12.5,
      transactionGrowth: 8.3,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard stats';
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
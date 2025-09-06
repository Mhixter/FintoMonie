import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@fintomonie/shared';

interface UsersState {
  users: User[];
  totalUsers: number;
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
}

const initialState: UsersState = {
  users: [],
  totalUsers: 0,
  isLoading: false,
  error: null,
  page: 1,
  limit: 20,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page, limit }: { page: number; limit: number }) => {
    // Mock data for demo
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUsers: User[] = Array.from({ length: limit }, (_, index) => ({
      id: `user-${page}-${index}`,
      email: `user${index + (page - 1) * limit}@example.com`,
      firstName: `User${index + 1}`,
      lastName: `Lastname${index + 1}`,
      phoneNumber: `+234801234567${index}`,
      kycStatus: ['pending', 'verified', 'rejected'][Math.floor(Math.random() * 3)] as any,
      isActive: Math.random() > 0.2,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    }));

    return {
      users: mockUsers,
      totalUsers: 15420,
      page,
      limit,
    };
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
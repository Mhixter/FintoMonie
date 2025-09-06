export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile'
  },
  WALLET: {
    BALANCE: '/wallet/balance',
    DEPOSIT: '/wallet/deposit',
    WITHDRAW: '/wallet/withdraw',
    TRANSFER: '/wallet/transfer',
    TRANSACTIONS: '/wallet/transactions'
  },
  SAVINGS: {
    GOALS: '/savings/goals',
    CREATE_GOAL: '/savings/goals',
    FUND_GOAL: '/savings/goals/:id/fund'
  },
  LOANS: {
    APPLY: '/loans/apply',
    MY_LOANS: '/loans/my-loans',
    REPAY: '/loans/:id/repay'
  },
  KYC: {
    UPLOAD_DOCUMENT: '/kyc/upload',
    DOCUMENTS: '/kyc/documents',
    VERIFY_BVN: '/kyc/verify-bvn',
    VERIFY_NIN: '/kyc/verify-nin'
  },
  PAYMENTS: {
    INITIALIZE: '/payments/initialize',
    VERIFY: '/payments/verify',
    BILL_PAYMENT: '/payments/bills'
  }
} as const;

export const CURRENCIES = {
  NGN: 'NGN',
  USD: 'USD'
} as const;

export const TRANSACTION_LIMITS = {
  DAILY_LIMIT: 1000000, // 1M Naira
  SINGLE_TRANSACTION_LIMIT: 500000, // 500K Naira
  MONTHLY_LIMIT: 10000000 // 10M Naira
} as const;

export const LOAN_TERMS = {
  MIN_AMOUNT: 50000,
  MAX_AMOUNT: 5000000,
  MIN_DURATION: 3, // months
  MAX_DURATION: 24, // months
  INTEREST_RATE: 0.15 // 15% per annum
} as const;
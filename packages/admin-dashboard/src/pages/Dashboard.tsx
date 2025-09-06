import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { 
  Users, 
  CreditCard, 
  Wallet, 
  TrendingUp,
  AlertTriangle,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, isLoading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Mock chart data
  const monthlyTransactionData = [
    { name: 'Jan', transactions: 4000, volume: 24000000 },
    { name: 'Feb', transactions: 3000, volume: 13980000 },
    { name: 'Mar', transactions: 2000, volume: 23000000 },
    { name: 'Apr', transactions: 2780, volume: 39080000 },
    { name: 'May', transactions: 1890, volume: 48000000 },
    { name: 'Jun', transactions: 2390, volume: 38000000 },
  ];

  const userGrowthData = [
    { name: 'Week 1', users: 1200 },
    { name: 'Week 2', users: 1800 },
    { name: 'Week 3', users: 1600 },
    { name: 'Week 4', users: 2100 },
  ];

  const transactionTypeData = [
    { name: 'Deposits', value: 45, color: '#10B981' },
    { name: 'Withdrawals', value: 25, color: '#EF4444' },
    { name: 'Transfers', value: 30, color: '#2196F3' },
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: stats?.monthlyGrowth || 0,
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions || 0,
      change: stats?.transactionGrowth || 0,
      changeType: 'increase',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Wallet Balance',
      value: stats?.totalWalletBalance || 0,
      change: 5.2,
      changeType: 'increase',
      icon: Wallet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      isCurrency: true,
    },
    {
      title: 'Transaction Volume',
      value: stats?.totalTransactionVolume || 0,
      change: 2.1,
      changeType: 'decrease',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      isCurrency: true,
    },
    {
      title: 'Pending Loans',
      value: stats?.pendingLoans || 0,
      change: 0,
      changeType: 'neutral',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      change: 8.1,
      changeType: 'increase',
      icon: UserCheck,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.isCurrency ? formatCurrency(stat.value) : formatNumber(stat.value)}
                </p>
                {stat.change !== 0 && (
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : stat.changeType === 'decrease' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    ) : null}
                    <span className={`text-sm font-medium ml-1 ${
                      stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTransactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'volume' ? formatCurrency(value as number) : formatNumber(value as number),
                  name === 'volume' ? 'Volume' : 'Transactions'
                ]}
              />
              <Bar dataKey="transactions" fill="#2196F3" name="transactions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth (This Month)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatNumber(value as number), 'New Users']} />
              <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={transactionTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {transactionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {transactionTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { type: 'user', message: 'New user registration: john.doe@example.com', time: '2 minutes ago', color: 'text-blue-600' },
              { type: 'transaction', message: 'Large transaction detected: ₦500,000', time: '5 minutes ago', color: 'text-orange-600' },
              { type: 'kyc', message: 'KYC document submitted for review', time: '10 minutes ago', color: 'text-green-600' },
              { type: 'loan', message: 'Loan application approved: ₦200,000', time: '15 minutes ago', color: 'text-purple-600' },
              { type: 'alert', message: 'System maintenance scheduled for tonight', time: '1 hour ago', color: 'text-red-600' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.color.replace('text-', 'bg-')}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { TrendingUp, Users, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AnalyticsPage: React.FC = () => {
  // Mock data for charts
  const monthlyData = [
    { name: 'Jan', users: 1200, transactions: 4500, volume: 45000000 },
    { name: 'Feb', users: 1800, transactions: 5200, volume: 52000000 },
    { name: 'Mar', users: 2100, transactions: 6800, volume: 68000000 },
    { name: 'Apr', users: 2400, transactions: 7200, volume: 72000000 },
    { name: 'May', users: 2800, transactions: 8100, volume: 81000000 },
    { name: 'Jun', users: 3200, transactions: 9500, volume: 95000000 },
  ];

  const transactionTypeData = [
    { name: 'Deposits', value: 45, color: '#10B981' },
    { name: 'Withdrawals', value: 25, color: '#EF4444' },
    { name: 'Transfers', value: 30, color: '#2196F3' },
  ];

  const userAcquisitionData = [
    { name: 'Week 1', organic: 120, referral: 80, paid: 40 },
    { name: 'Week 2', organic: 180, referral: 120, paid: 60 },
    { name: 'Week 3', organic: 160, referral: 100, paid: 80 },
    { name: 'Week 4', organic: 210, referral: 140, paid: 90 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 125000, profit: 45000 },
    { name: 'Feb', revenue: 142000, profit: 52000 },
    { name: 'Mar', revenue: 168000, profit: 61000 },
    { name: 'Apr', revenue: 185000, profit: 68000 },
    { name: 'May', revenue: 201000, profit: 74000 },
    { name: 'Jun', revenue: 225000, profit: 82000 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const kpiCards = [
    {
      title: 'Monthly Active Users',
      value: '12,890',
      change: 12.5,
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Transaction Volume',
      value: formatCurrency(95000000),
      change: 8.3,
      changeType: 'increase',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Revenue',
      value: formatCurrency(225000),
      change: 15.2,
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: -2.1,
      changeType: 'decrease',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Comprehensive business insights and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>Last month</option>
            <option>Last week</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.changeType === 'increase' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toLocaleString(), 'Users']} />
              <Area type="monotone" dataKey="users" stroke="#2196F3" fill="#2196F3" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Volume */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Volume']} />
              <Bar dataKey="volume" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Distribution</h3>
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

        {/* User Acquisition */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Acquisition Channels</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userAcquisitionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="organic" stackId="a" fill="#10B981" name="Organic" />
              <Bar dataKey="referral" stackId="a" fill="#2196F3" name="Referral" />
              <Bar dataKey="paid" stackId="a" fill="#F97316" name="Paid" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Profit Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
            <Line type="monotone" dataKey="revenue" stroke="#2196F3" strokeWidth={3} name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { metric: 'Customer Acquisition Cost', current: '₦2,450', previous: '₦2,680', change: -8.6, target: '₦2,000' },
                { metric: 'Customer Lifetime Value', current: '₦45,200', previous: '₦42,100', change: 7.4, target: '₦50,000' },
                { metric: 'Average Transaction Size', current: '₦8,750', previous: '₦8,200', change: 6.7, target: '₦10,000' },
                { metric: 'Monthly Churn Rate', current: '2.1%', previous: '2.8%', change: -25.0, target: '1.5%' },
                { metric: 'Net Promoter Score', current: '72', previous: '68', change: 5.9, target: '80' },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.metric}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.current}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.previous}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {row.change > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={row.change > 0 ? 'text-green-600' : 'text-red-600'}>
                        {row.change > 0 ? '+' : ''}{row.change}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
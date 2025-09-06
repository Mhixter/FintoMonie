import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Loan {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid';
  purposeOfLoan: string;
  monthlyRepayment: number;
  totalRepayment: number;
  amountRepaid: number;
  createdAt: Date;
  approvedAt?: Date;
}

const LoansPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const loans: Loan[] = Array.from({ length: 20 }, (_, index) => ({
    id: `loan-${index + 1}`,
    userId: `user-${index + 1}`,
    userName: `User ${index + 1}`,
    userEmail: `user${index + 1}@example.com`,
    amount: Math.floor(Math.random() * 500000) + 50000,
    interestRate: 0.15,
    duration: [3, 6, 12, 18, 24][Math.floor(Math.random() * 5)],
    status: ['pending', 'approved', 'rejected', 'disbursed', 'repaid'][Math.floor(Math.random() * 5)] as any,
    purposeOfLoan: ['Business expansion', 'Medical expenses', 'Education', 'Home improvement', 'Emergency'][Math.floor(Math.random() * 5)],
    monthlyRepayment: 0,
    totalRepayment: 0,
    amountRepaid: Math.floor(Math.random() * 100000),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    approvedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) : undefined,
  })).map(loan => {
    const monthlyRate = loan.interestRate / 12;
    const monthlyRepayment = (loan.amount * monthlyRate * Math.pow(1 + monthlyRate, loan.duration)) /
                            (Math.pow(1 + monthlyRate, loan.duration) - 1);
    return {
      ...loan,
      monthlyRepayment: Math.round(monthlyRepayment),
      totalRepayment: Math.round(monthlyRepayment * loan.duration),
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved', icon: Check },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: X },
      disbursed: { color: 'bg-blue-100 text-blue-800', label: 'Disbursed', icon: DollarSign },
      repaid: { color: 'bg-gray-100 text-gray-800', label: 'Repaid', icon: Check },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveLoan = (loanId: string) => {
    if (confirm('Are you sure you want to approve this loan?')) {
      // In real app, this would call the API
      console.log('Approving loan:', loanId);
    }
  };

  const handleRejectLoan = (loanId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      // In real app, this would call the API
      console.log('Rejecting loan:', loanId, 'Reason:', reason);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
          <p className="text-gray-600">Review and manage loan applications</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total Applications: {loans.length}
          </div>
          <div className="text-sm text-gray-500">
            Pending: {loans.filter(l => l.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Loans', value: loans.length, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { title: 'Pending Review', value: loans.filter(l => l.status === 'pending').length, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
          { title: 'Approved', value: loans.filter(l => l.status === 'approved').length, color: 'text-green-600', bgColor: 'bg-green-50' },
          { title: 'Total Value', value: loans.reduce((sum, loan) => sum + loan.amount, 0), color: 'text-purple-600', bgColor: 'bg-purple-50', isCurrency: true },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <DollarSign className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.isCurrency ? formatCurrency(stat.value) : stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by user name, email, or loan ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="disbursed">Disbursed</option>
              <option value="repaid">Repaid</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {loan.userName.split(' ').map(n => n.charAt(0)).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{loan.userName}</div>
                        <div className="text-sm text-gray-500">{loan.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{loan.purposeOfLoan}</div>
                    <div className="text-sm text-gray-500">
                      {loan.duration} months • {(loan.interestRate * 100).toFixed(1)}% APR
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(loan.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Monthly: {formatCurrency(loan.monthlyRepayment)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(loan.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(loan.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-primary hover:text-primary/80 p-1 rounded transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {loan.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveLoan(loan.id)}
                            className="text-green-600 hover:text-green-500 p-1 rounded transition-colors" 
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRejectLoan(loan.id)}
                            className="text-red-600 hover:text-red-500 p-1 rounded transition-colors" 
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(20, filteredLoans.length)}</span> of{' '}
                <span className="font-medium">{filteredLoans.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-primary text-sm font-medium text-white">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
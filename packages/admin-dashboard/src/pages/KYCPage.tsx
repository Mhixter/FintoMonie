import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface KYCDocument {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'identity_card' | 'passport' | 'drivers_license' | 'utility_bill' | 'bank_statement';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
}

const KYCPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data
  const documents: KYCDocument[] = Array.from({ length: 25 }, (_, index) => ({
    id: `doc-${index + 1}`,
    userId: `user-${index + 1}`,
    userName: `User ${index + 1}`,
    userEmail: `user${index + 1}@example.com`,
    type: ['identity_card', 'passport', 'drivers_license', 'utility_bill', 'bank_statement'][Math.floor(Math.random() * 5)] as any,
    url: `https://example.com/documents/doc-${index + 1}.pdf`,
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as any,
    verifiedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : undefined,
    rejectionReason: Math.random() > 0.8 ? 'Document quality is poor' : undefined,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }));

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review', icon: AlertCircle },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved', icon: Check },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: X },
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

  const getDocumentTypeLabel = (type: string) => {
    const typeLabels = {
      identity_card: 'Identity Card',
      passport: 'Passport',
      drivers_license: 'Driver\'s License',
      utility_bill: 'Utility Bill',
      bank_statement: 'Bank Statement',
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApproveDocument = (docId: string) => {
    if (confirm('Are you sure you want to approve this document?')) {
      // In real app, this would call the API
      console.log('Approving document:', docId);
    }
  };

  const handleRejectDocument = (docId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      // In real app, this would call the API
      console.log('Rejecting document:', docId, 'Reason:', reason);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Management</h1>
          <p className="text-gray-600">Review and verify customer documents</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total Documents: {documents.length}
          </div>
          <div className="text-sm text-gray-500">
            Pending: {documents.filter(d => d.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Documents', value: documents.length, color: 'text-blue-600', bgColor: 'bg-blue-50', icon: FileText },
          { title: 'Pending Review', value: documents.filter(d => d.status === 'pending').length, color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: AlertCircle },
          { title: 'Approved', value: documents.filter(d => d.status === 'approved').length, color: 'text-green-600', bgColor: 'bg-green-50', icon: Check },
          { title: 'Rejected', value: documents.filter(d => d.status === 'rejected').length, color: 'text-red-600', bgColor: 'bg-red-50', icon: X },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by user name, email, or document ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="identity_card">Identity Card</option>
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
              <option value="utility_bill">Utility Bill</option>
              <option value="bank_statement">Bank Statement</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Date Range
            </button>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {document.userName.split(' ').map(n => n.charAt(0)).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{document.userName}</div>
                        <div className="text-sm text-gray-500">{document.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {getDocumentTypeLabel(document.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(document.status)}
                    {document.rejectionReason && (
                      <div className="text-xs text-red-600 mt-1">
                        {document.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(document.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.verifiedAt ? format(new Date(document.verifiedAt), 'MMM dd, yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => window.open(document.url, '_blank')}
                        className="text-primary hover:text-primary/80 p-1 rounded transition-colors" 
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {document.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveDocument(document.id)}
                            className="text-green-600 hover:text-green-500 p-1 rounded transition-colors" 
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRejectDocument(document.id)}
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(20, filteredDocuments.length)}</span> of{' '}
                <span className="font-medium">{filteredDocuments.length}</span> results
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

export default KYCPage;
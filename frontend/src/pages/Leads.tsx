import { useState, useEffect } from 'react';
import { getLeads, deleteLead } from '../services/leads';
import { type Lead, type PaginatedResponse } from '../types';
import { LeadFormModal } from '../components/forms/LeadFormModal';
import { 
  Search, Filter, Plus, Download, ChevronLeft, ChevronRight, 
  Loader2, AlertCircle, Edit, Trash2 
} from 'lucide-react';

export const Leads = () => {
  const [data, setData] = useState<PaginatedResponse<Lead> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getLeads({
          page,
          search: debouncedSearch,
          status: statusFilter,
          source: sourceFilter,
          sortBy: 'Latest',
        });
        setData(response);
      } catch (err: any) {
        setError('Failed to fetch leads data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [debouncedSearch, statusFilter, sourceFilter, page, refreshTrigger]);

  // Handle CSV Export
  const handleExportCSV = () => {
    if (!data || data.data.length === 0) {
      alert("No data available to export!");
      return;
    }
    
    const headers = ['Name', 'Email', 'Status', 'Source', 'Date Created'];
    const csvContent = [
      headers.join(','),
      ...data.data.map(lead => 
        `"${lead.name}","${lead.email}","${lead.status}","${lead.source}","${new Date(lead.createdAt).toLocaleDateString()}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Handle successful lead creation/update
  const handleLeadAdded = () => {
    setIsModalOpen(false);
    setLeadToEdit(null);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead? This cannot be undone.')) {
      try {
        await deleteLead(id);
        setRefreshTrigger(prev => prev + 1); 
      } catch (err) {
        alert('Failed to delete the lead.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 ring-blue-500/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/30';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 ring-yellow-500/20 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500/30';
      case 'Qualified': return 'bg-green-100 text-green-800 ring-green-500/20 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-500/30';
      case 'Lost': return 'bg-red-100 text-red-800 ring-red-500/20 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-500/30';
      default: return 'bg-gray-100 text-gray-800 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      <LeadFormModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setLeadToEdit(null);
        }} 
        onSuccess={handleLeadAdded} 
        initialData={leadToEdit}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Leads Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 transition-colors">Track and manage your sales pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Advanced Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 transition-colors">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors bg-white dark:bg-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
          />
        </div>

        <div className="w-full md:w-48 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400 dark:text-slate-500" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white dark:bg-slate-800 dark:text-white transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="w-full md:w-48 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400 dark:text-slate-500" />
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white dark:bg-slate-800 dark:text-white transition-colors"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
            <thead className="bg-gray-50 dark:bg-slate-800/50 transition-colors">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Lead Details</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date Added</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800 transition-colors">
              
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Loading leads...</p>
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                  </td>
                </tr>
              )}

              {!loading && !error && data?.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                      <Search className="h-10 w-10 text-gray-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No leads found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}

              {!loading && !error && data?.data.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</span>
                      <span className="text-sm text-gray-500 dark:text-slate-400">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-slate-400">{lead.source}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setLeadToEdit(lead);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !error && data && data.meta.totalPages > 0 && (
          <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between transition-colors">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700 dark:text-slate-300">
                Showing page <span className="font-semibold">{data.meta.currentPage}</span> of{' '}
                <span className="font-semibold">{data.meta.totalPages}</span> (Total records: {data.meta.totalRecords})
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!data.meta.hasPrevPage}
                className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!data.meta.hasNextPage}
                className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
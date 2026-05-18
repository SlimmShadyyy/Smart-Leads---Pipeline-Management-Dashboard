import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, UserCheck, TrendingUp, Activity, 
  ArrowUpRight, Clock, Plus, Loader2
} from 'lucide-react';
import { getLeads } from '../services/leads';
import {type Lead } from '../types';

export const Overview = () => {
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getLeads({ page: 1, sortBy: 'Latest' });
        setRecentLeads(response.data);
        setTotalLeads(response.meta.totalRecords);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const qualifiedCount = recentLeads.filter(l => l.status === 'Qualified').length;
  
  const stats = [
    { name: 'Total Leads', value: totalLeads.toString(), trend: 'up', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Recent Qualified', value: qualifiedCount.toString(), trend: 'up', icon: UserCheck, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Conversion Rate', value: '33.2%', trend: 'up', icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { name: 'Active Pipeline', value: totalLeads > 0 ? (totalLeads - qualifiedCount).toString() : '0', trend: 'up', icon: Activity, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-500" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">Here is what's happening with your leads today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/dashboard/leads"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Go to Leads Management
          </Link>
        </div>
      </div>

      {/* Dynamic KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-md transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl transition-colors ${stat.bg}`}>
                  <Icon className={`h-6 w-6 transition-colors ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 transition-colors">
                  <ArrowUpRight className="h-4 w-4" /> Live Data
                </div>
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">{stat.name}</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 transition-colors">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2 flex flex-col transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 transition-colors">Pipeline Growth</h3>
          <div className="flex-1 min-h-[300px] bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-center border-dashed transition-colors">
            <div className="text-center text-slate-400 dark:text-slate-500 transition-colors">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Chart integration goes here.</p>
              <p className="text-xs mt-1">(e.g., using Recharts with your backend data)</p>
            </div>
          </div>
        </div>

        {/* Dynamic Recent Activity Feed */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">Recent Activity</h3>
            <Link to="/dashboard/leads" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="flex-1 space-y-6">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4 transition-colors">No recent activity.</p>
            ) : (
              recentLeads.slice(0, 5).map((lead, index) => (
                <div key={lead._id} className="flex gap-4 relative">
                  {index !== Math.min(recentLeads.length - 1, 4) && (
                    <div className="absolute top-8 bottom-[-24px] left-[19px] w-[2px] bg-slate-100 dark:bg-slate-800 transition-colors" />
                  )}
                  <div className="relative z-10 flex-shrink-0 mt-1">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 transition-colors
                      ${lead.status === 'New' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                        lead.status === 'Qualified' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 
                        lead.status === 'Lost' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}
                    `}>
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">
                      New {lead.status} Lead
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">{lead.name} ({lead.source})</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">
                      {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};
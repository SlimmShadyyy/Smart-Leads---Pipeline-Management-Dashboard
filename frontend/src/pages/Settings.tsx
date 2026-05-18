import { useState } from 'react';
import { 
  Shield, Bell, Database, Users, Save, Moon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { TeamModal } from '../components/forms/TeamModal';

export const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      <TeamModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)} 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">System Settings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">Manage application preferences and user access.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 w-full sm:w-auto"
        >
          {isSaving ? 'Saving...' : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        
        {/* Profile Info */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-1 h-fit transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Name</label>
              <p className="text-slate-900 dark:text-white font-medium bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">{user?.name}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email</label>
              <p className="text-slate-900 dark:text-white font-medium bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">{user?.email}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Role Permission</label>
              <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md font-medium text-sm border border-blue-100 dark:border-blue-800 mt-1 transition-colors">
                <Shield className="h-3.5 w-3.5" />
                {user?.role} Access
              </div>
            </div>
          </div>
        </div>

        {/* System Configurations */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Notifications Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts for new leads and status changes.</p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifs ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} onClick={() => setEmailNotifs(!emailNotifs)}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Weekly Reports</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Get a weekly CSV summary of pipeline activity sent to your email.</p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${weeklyReports ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} onClick={() => setWeeklyReports(!weeklyReports)}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${weeklyReports ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>
            </div>
          </div>

          {/* User Management Mock */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Management</h3>
              </div>
              <button 
                onClick={() => setIsTeamModalOpen(true)}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Manage Team
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              As an Admin, you can invite new users and assign them either Admin or Sales User roles.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm transition-colors">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name} (You)</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 transition-colors">
                  Admin
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center opacity-60 grayscale dark:grayscale-0 dark:opacity-80 transition-opacity">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm transition-colors">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Sales Representative</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">sales@example.com</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 transition-colors">
                  Sales User
                </span>
              </div>
            </div>
          </div>

          {/* Bonus Feature Teaser: Data & Appearance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  <h3 className="text-md font-bold text-slate-900 dark:text-white">Data Backup</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Export a complete backup of all database records.</p>
              </div>
              <button className="w-full py-2 px-4 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Download Full Backup
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  <h3 className="text-md font-bold text-slate-900 dark:text-white">Appearance</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Toggle application color theme.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className="w-full py-2 px-4 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex justify-center items-center gap-2"
              >
                {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
import ThemeToggle from '@components/ui/ThemeToggle';
import { useDispatch } from 'react-redux';
import { toastSuccess } from '@features/ui/uiSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(toastSuccess('Settings saved successfully.'));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
        <p className="text-sm text-slate-400 mt-1">Configure application preferences and appearance.</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        
        {/* Appearance Section */}
        <div className="p-6 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Appearance</h3>
            <p className="text-xs text-slate-400">Choose between light and dark mode for the dashboard interface.</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Notifications Section */}
        <div className="p-6 border-b border-slate-800/60">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-100 mb-1">Notifications</h3>
            <p className="text-xs text-slate-400">Manage how you receive alerts for new critical events.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700 focus:ring-blue-600 focus:ring-2" />
              <span className="text-sm text-slate-300">Push Notifications for Magnitude 6.0+</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700 focus:ring-blue-600 focus:ring-2" />
              <span className="text-sm text-slate-300">Email summary reports (Weekly)</span>
            </label>
          </div>
        </div>

        {/* Data Preferences */}
        <div className="p-6 border-b border-slate-800/60">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-100 mb-1">Data Preferences</h3>
            <p className="text-xs text-slate-400">Configure default values for the data table.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Default Rows Per Page</label>
              <select className="px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm outline-none w-full sm:w-48">
                <option value="10">10 Rows</option>
                <option value="25">25 Rows</option>
                <option value="50">50 Rows</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Default Sort Order</label>
              <select className="px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm outline-none w-full sm:w-48">
                <option value="-time">Newest First</option>
                <option value="-magnitude">Highest Magnitude</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-900 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;

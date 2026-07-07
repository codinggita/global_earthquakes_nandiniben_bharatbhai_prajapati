import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@features/auth/authSlice';
import { toastSuccess, toastInfo } from '@features/ui/uiSlice';
import PageSEO from '@components/ui/PageSEO';

const ProfilePage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(toastInfo('Profile updating is currently disabled in this demo environment.'));
  };

  const handlePasswordReset = () => {
    dispatch(toastSuccess('A password reset link has been sent to your email.'));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <PageSEO title="My Profile" description="Manage your account profile" />
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Your Profile</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-blue-600 to-violet-700 shadow-xl shadow-blue-900/30 mb-4">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <h3 className="text-lg font-bold text-slate-100">{user?.name || 'User Name'}</h3>
            <p className="text-sm text-slate-400 mb-4">{user?.email || 'user@example.com'}</p>
            
            <div className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active Account
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">Personal Information</h3>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || ''}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bio / Organization</label>
                  <textarea 
                    rows="3"
                    placeholder="E.g. Seismologist at Global Earth Institute"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={handlePasswordReset}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Reset Password
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import { useEffect } from 'react';
import useEarthquakes from '@hooks/useEarthquakes';
import StatCard from '@components/dashboard/StatCard';
import RecentEarthquakes from '@components/dashboard/RecentEarthquakes';
import ActivityFeed from '@components/dashboard/ActivityFeed';
import MagnitudeBreakdown from '@components/dashboard/MagnitudeBreakdown';
import PageSEO from '@components/ui/PageSEO';

const DashboardPage = () => {
  const { recent, critical, stats, loading, error, refreshDashboard } = useEarthquakes(true, true);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <PageSEO title="Dashboard" description="Overview of the latest global earthquake events" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time global earthquake activity and metrics.</p>
        </div>
        <button 
          onClick={() => refreshDashboard()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <span className="spinner w-4 h-4" /> : '↻'} 
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          Failed to load dashboard data: {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Events" 
          value={stats.total?.toLocaleString() || "0"} 
          icon="📊" 
          trend={+5.2}
          colorClass="from-blue-500 to-indigo-600"
        />
        <StatCard 
          title="Highest Magnitude" 
          value={stats.highestMag?.toFixed(1) || "0.0"} 
          icon="⚠️" 
          trend={-1.4}
          colorClass="from-red-500 to-rose-600"
        />
        <StatCard 
          title="Average Depth" 
          value={`${stats.avgDepth?.toFixed(1) || "0"} km`} 
          icon="🌊" 
          colorClass="from-cyan-500 to-blue-600"
        />
        <StatCard 
          title="Active Regions" 
          value="142" 
          icon="🗺️" 
          subtext="Countries"
          colorClass="from-emerald-500 to-teal-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (takes 2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="h-[400px]">
            <RecentEarthquakes data={recent} loading={loading} />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <div className="h-[250px]">
            <MagnitudeBreakdown data={recent} loading={loading} />
          </div>
          <div className="flex-1 min-h-[250px]">
            <ActivityFeed data={critical} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

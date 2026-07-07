import MonthlyTrend from '@components/analytics/MonthlyTrend';
import TypeDistribution from '@components/analytics/TypeDistribution';
import CountryChart from '@components/analytics/CountryChart';
import PageSEO from '@components/ui/PageSEO';

const AnalyticsPage = () => {
  const { data, loading, error, refetch } = useStats();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <PageSEO title="Analytics" description="View global earthquake analytics and trends" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Analytics & Insights</h2>
          <p className="text-sm text-slate-400 mt-1">Deep dive into global seismic trends and distributions.</p>
        </div>
        <button 
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <span className="spinner w-4 h-4" /> : '↻'} 
          Refresh Data
        </button>
      </div>

      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          Failed to load analytics: {error}
        </div>
      )}

      {/* Top Level Summary Grid */}
      <StatsGrid summary={data.summary} loading={loading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Monthly Trend (Bar) */}
        <div className="h-[350px]">
          <MonthlyTrend data={data.monthlyCount} loading={loading} />
        </div>
        
        {/* Type Distribution (Pie) */}
        <div className="h-[350px]">
          <TypeDistribution data={data.typeCount} loading={loading} />
        </div>
        
        {/* Country Distribution (Horizontal Bar) - Spans full width on large */}
        <div className="lg:col-span-2 h-[450px]">
          <CountryChart data={data.countryCount} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

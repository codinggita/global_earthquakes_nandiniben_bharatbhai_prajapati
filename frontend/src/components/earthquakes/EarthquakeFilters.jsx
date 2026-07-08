import { useState, useCallback } from 'react';
import SearchBar from '@components/ui/SearchBar';

const EarthquakeFilters = ({ onFilterChange, currentFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    minMag: '',
    status: '',
    sort: '-time'
  });

  const handleChange = useCallback((key, value) => {
    setFilters(prev => {
      if (prev[key] === value) return prev; // no-op if same value
      const updated = { ...prev, [key]: value };
      onFilterChange(updated);
      return updated;
    });
  }, [onFilterChange]);

  const handleSearch = useCallback((val) => handleChange('search', val), [handleChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 mb-6">
      
      <div className="w-full md:w-auto flex-1">
        <SearchBar 
          placeholder="Search by location..." 
          onSearch={handleSearch} 
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <select 
          className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
          value={filters.minMag}
          onChange={(e) => handleChange('minMag', e.target.value)}
        >
          <option value="">Any Magnitude</option>
          <option value="4">4.0+ (Light)</option>
          <option value="5">5.0+ (Moderate)</option>
          <option value="6">6.0+ (Strong)</option>
          <option value="7">7.0+ (Major)</option>
        </select>

        <select 
          className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="reviewed">Reviewed</option>
          <option value="automatic">Automatic</option>
        </select>

        <select 
          className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
          value={filters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          <option value="-time">Newest First</option>
          <option value="time">Oldest First</option>
          <option value="-magnitude">Highest Mag</option>
          <option value="magnitude">Lowest Mag</option>
          <option value="-depth">Deepest</option>
          <option value="depth">Shallowest</option>
        </select>
      </div>

    </div>
  );
};

export default EarthquakeFilters;

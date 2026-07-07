import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search...", delay = 500 }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, onSearch, delay]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input 
        type="search" 
        className="block w-full p-2.5 pl-10 text-sm rounded-lg bg-slate-900 border border-slate-700 placeholder-slate-500 text-slate-100 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none" 
        placeholder={placeholder} 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toastSuccess, toastError } from '@features/ui/uiSlice';
import useEarthquakes from '@hooks/useEarthquakes';

import EarthquakeFilters from '@components/earthquakes/EarthquakeFilters';
import EarthquakeTable from '@components/earthquakes/EarthquakeTable';
import EarthquakeModal from '@components/earthquakes/EarthquakeModal';
import DeleteConfirmModal from '@components/earthquakes/DeleteConfirmModal';
import Pagination from '@components/ui/Pagination';
import SkeletonLoader from '@components/ui/SkeletonLoader';
import EmptyState from '@components/ui/EmptyState';
import PageSEO from '@components/ui/PageSEO';

const EarthquakesPage = () => {
  const dispatch = useDispatch();
  const { 
    list, pagination, loading, listLoading, error, 
    loadMore, createRecord, updateRecord, deleteRecord 
  } = useEarthquakes(false);

  const [filters, setFilters] = useState({ page: 1, limit: 10, sort: '-time' });
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch when filters change
  useEffect(() => {
    loadMore(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleCreateNew = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDeleteRequest = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleSave = async (values) => {
    setActionLoading(true);
    try {
      if (selectedItem) {
        // Update
        const result = await updateRecord(selectedItem._id || selectedItem.id, values);
        if (result.error) throw new Error(result.payload);
        dispatch(toastSuccess('Earthquake record updated successfully.'));
      } else {
        // Create
        const result = await createRecord(values);
        if (result.error) throw new Error(result.payload);
        dispatch(toastSuccess('Earthquake record created successfully.'));
      }
      setModalOpen(false);
      loadMore(filters); // refresh list
    } catch (err) {
      dispatch(toastError(err.message || 'Action failed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async (id) => {
    setActionLoading(true);
    try {
      const result = await deleteRecord(id);
      if (result.error) throw new Error(result.payload);
      dispatch(toastSuccess('Record deleted permanently.'));
      setDeleteModalOpen(false);
      loadMore(filters); // refresh list
    } catch (err) {
      dispatch(toastError(err.message || 'Failed to delete record'));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <PageSEO title="Earthquakes Database" description="Search and manage earthquake records" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Earthquake Records</h2>
          <p className="text-sm text-slate-400 mt-1">Manage, filter, and analyze global seismic events.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
        >
          ✨ Add New Record
        </button>
      </div>

      {/* Filters */}
      <EarthquakeFilters onFilterChange={handleFilterChange} currentFilters={filters} />

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          Failed to load data: {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg flex flex-col overflow-hidden min-h-[400px] relative">
        {/* Overlay spinner when switching pages (keeps existing rows visible) */}
        {listLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-400 text-sm">Loading page…</span>
            </div>
          </div>
        )}
        {loading ? (
          <div className="p-6">
            <SkeletonLoader count={8} />
          </div>
        ) : list.length === 0 ? (
          <EmptyState 
            title="No earthquakes found" 
            message="Try adjusting your filters, clearing your search, or adding a new record." 
            actionLabel="Clear Filters"
            onAction={() => setFilters({ page: 1, limit: 10, sort: '-time' })}
          />
        ) : (
          <>
            <EarthquakeTable 
              data={list} 
              onEdit={handleEdit} 
              onDelete={handleDeleteRequest} 
            />
            
            <Pagination 
              currentPage={pagination.page || 1} 
              totalPages={pagination.totalPages || 1} 
              onPageChange={handlePageChange} 
            />
          </>
        )}
      </div>

      {/* Modals */}
      <EarthquakeModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSave}
        item={selectedItem}
        loading={actionLoading}
      />

      <DeleteConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        item={selectedItem}
        loading={actionLoading}
      />
    </div>
  );
};

export default EarthquakesPage;

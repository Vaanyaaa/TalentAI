import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import JobCard from '../../components/jobs/JobCard';
import JobFilter from '../../components/jobs/JobFilter';
import Spinner from '../../components/common/Spinner';
import Navbar from '../../components/common/Navbar';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ employmentType: '', experienceRequired: '', location: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilter, setShowFilter] = useState(false);

  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (filters.location) params.append('location', filters.location);
      if (filters.employmentType) params.append('employmentType', filters.employmentType);
      if (filters.experienceRequired) params.append('experienceRequired', filters.experienceRequired);
      params.append('page', page);
      params.append('limit', 12);

      const { data } = await api.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, filters]);

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
  };

  const clearFilters = () => {
    setFilters({ employmentType: '', experienceRequired: '', location: '' });
    setKeyword('');
    setSearchInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Browse Jobs</h1>
          <p className="text-slate-500 text-sm mb-5">
            {pagination.total > 0 ? `${pagination.total} opportunities found` : 'Find your perfect opportunity'}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                id="job-search-input"
                placeholder="Search by title, company, or skills..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-input pl-10 pr-4 py-3 w-full text-sm shadow-sm"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setKeyword(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary px-6 py-3 text-sm shadow-sm">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden flex items-center gap-2 btn-secondary py-3 px-4 text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar — desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <JobFilter filters={filters} onChange={setFilters} onClear={clearFilters} />
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {showFilter && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-end animate-fade-in">
              <div className="bg-white rounded-t-2xl p-5 w-full max-h-[80vh] overflow-y-auto animate-slide-in-right">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Filters</h3>
                  <button onClick={() => setShowFilter(false)} className="text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <JobFilter filters={filters} onChange={setFilters} onClear={clearFilters} />
                <button
                  onClick={() => setShowFilter(false)}
                  className="btn-primary w-full justify-center mt-4 py-3"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Job Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner size="lg" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-700 mb-1">No jobs found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn-secondary mt-4 text-sm">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => fetchJobs(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <span className="text-sm text-slate-500">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => fetchJobs(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseJobs;

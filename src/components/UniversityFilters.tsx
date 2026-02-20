'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import UniversitySkeleton from './UniversitySkeleton';
import CompareModal from './CompareModal';

interface University {
  _id: string;
  universityName: string;
  country: string;
  location: string;
  tuitionFee: number;
  ranking: number;
  establishedYear: number;
}

interface FilterState {
  search: string;
  countries: string;
  region: string;
  minTuition: string;
  maxTuition: string;
  affordability: string[];
  topTier: string;
  institutionAge: string[];
  valueForMoney: boolean;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

export default function UniversityFilters() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    countries: '',
    region: '',
    minTuition: '',
    maxTuition: '',
    affordability: [],
    topTier: '',
    institutionAge: [],
    valueForMoney: false,
    sortBy: 'ranking',
    sortOrder: 'asc',
    page: 1,
    limit: 20,
  });

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUniversities();
    }, filters.search ? 500 : 0); 

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);

    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.countries) params.append('countries', filters.countries);
    if (filters.region) params.append('region', filters.region);
    if (filters.minTuition) params.append('minTuition', filters.minTuition);
    if (filters.maxTuition) params.append('maxTuition', filters.maxTuition);
    if (filters.affordability.length)
      params.append('affordability', filters.affordability.join(','));
    if (filters.topTier) params.append('topTier', filters.topTier);
    if (filters.institutionAge.length)
      params.append('institutionAge', filters.institutionAge.join(','));
    if (filters.valueForMoney) params.append('valueForMoney', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());

    try {
      const response = await fetch(`/api?${params.toString()}`, {
        next: { revalidate: 60 } 
      });
      const data = await response.json();
      setUniversities(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleCheckboxChange = useCallback((
    field: 'affordability' | 'institutionAge',
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      countries: '',
      region: '',
      minTuition: '',
      maxTuition: '',
      affordability: [],
      topTier: '',
      institutionAge: [],
      valueForMoney: false,
      sortBy: 'ranking',
      sortOrder: 'asc',
      page: 1,
      limit: 20,
    });
  }, []);

  const handleCompareToggle = useCallback((universityId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(universityId)) {
        return prev.filter((id) => id !== universityId);
      } else if (prev.length < 2) {
        return [...prev, universityId];
      } else {
        return [prev[1], universityId];
      }
    });
  }, []);

  const handleCompare = useCallback(() => {
    if (selectedForCompare.length === 2) {
      setShowCompareModal(true);
    }
  }, [selectedForCompare.length]);

  const clearComparison = useCallback(() => {
    setSelectedForCompare([]);
    setShowCompareModal(false);
  }, []);

  const getComparedUniversities = useMemo(() => {
    return universities.filter((uni) => selectedForCompare.includes(uni._id));
  }, [universities, selectedForCompare]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Find Your Perfect University
              </h1>
              <p className="text-gray-600">Discover and compare top universities worldwide</p>
            </div>

            {/* Compare Button */}
            {selectedForCompare.length > 0 && (
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{selectedForCompare.length}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">selected</span>
                </div>
                <button
                  onClick={handleCompare}
                  disabled={selectedForCompare.length !== 2}
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-sm">
                  Compare
                </button>
                <button
                  onClick={clearComparison}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Info Banner */}
          {selectedForCompare.length === 1 && (
            <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-blue-900 font-medium">
                Select one more university to compare side-by-side
              </p>
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search University
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value, page: 1 })
                  }
                  placeholder="e.g., Harvard, MIT, Oxford..."
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Region */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
              <select
                value={filters.region}
                onChange={(e) =>
                  setFilters({ ...filters, region: e.target.value, page: 1 })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">All Regions</option>
                <option value="north-america"> North America</option>
                <option value="europe"> Europe</option>
                <option value="asia-pacific"> Asia Pacific</option>
                <option value="middle-east"> Middle East</option>
                <option value="latin-america">Latin America</option>
                <option value="africa">Africa</option>
              </select>
            </div>

            {/* Tuition Range */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tuition Range (USD/year)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={filters.minTuition}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minTuition: e.target.value,
                      page: 1,
                    })
                  }
                  placeholder="Min"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  value={filters.maxTuition}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxTuition: e.target.value,
                      page: 1,
                    })
                  }
                  placeholder="Max"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Ranking */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">World Ranking</label>
              <select
                value={filters.topTier}
                onChange={(e) =>
                  setFilters({ ...filters, topTier: e.target.value, page: 1 })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">All Rankings</option>
                <option value="100">Top 100</option>
                <option value="200">Top 200</option>
                <option value="500">Top 500</option>
              </select>
            </div>

            {/* Value for Money */}
            <div className="flex items-end">
              <label className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-all w-full">
                <input
                  type="checkbox"
                  checked={filters.valueForMoney}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      valueForMoney: e.target.checked,
                      page: 1,
                    })
                  }
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-semibold text-green-900">
                  💎 Best Value
                </span>
              </label>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Affordability */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Affordability Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['budget', 'moderate', 'premium', 'luxury'].map((tier) => (
                    <label key={tier} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.affordability.includes(tier)}
                        onChange={() =>
                          handleCheckboxChange('affordability', tier)
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="capitalize text-sm font-medium text-gray-700">{tier}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Institution Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Institution Age
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['modern', 'established', 'historic', 'ancient'].map((age) => (
                    <label key={age} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.institutionAge.includes(age)}
                        onChange={() =>
                          handleCheckboxChange('institutionAge', age)
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="capitalize text-sm font-medium text-gray-700">{age}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Sort Results</label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value, page: 1 })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="ranking"> Ranking</option>
                <option value="tuitionFee"> Tuition Fee</option>
                <option value="universityName"> Name</option>
                <option value="establishedYear"> Year Established</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortOrder: e.target.value,
                    page: 1,
                  })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="asc">Ascending</option>
                <option value="desc"> Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div>
          {loading ? (
            <>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
              </div>
              <UniversitySkeleton />
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                    <p className="text-sm text-gray-600">universities found</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities.length === 0 ? (
                  <div className="col-span-full bg-white p-16 rounded-2xl shadow-lg border border-gray-200 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg mb-4">
                      No universities found matching your criteria
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-sm"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  universities.map((uni) => {
                    const isSelected = selectedForCompare.includes(uni._id);
                    return (
                      <div
                        key={uni._id}
                        className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                          isSelected 
                            ? 'border-blue-500 ring-4 ring-blue-100' 
                            : 'border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className={`h-2 ${isSelected ? 'bg-linear-to-r from-blue-500 to-indigo-500' : 'bg-linear-to-r from-gray-200 to-gray-300'}`}></div>
                        
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="h-15 text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {uni.universityName}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {uni.location}, {uni.country}
                              </p>
                            </div>
                            <button
                              onClick={() => handleCompareToggle(uni._id)}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                isSelected
                                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {isSelected ? '✓ Selected' : 'Compare'}
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl">
                              <span className="text-sm font-medium text-gray-700">World Ranking</span>
                              <span className="text-lg font-bold text-orange-600">#{uni.ranking}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl">
                              <span className="text-sm font-medium text-gray-700">Annual Tuition</span>
                              <span className="text-lg font-bold text-green-600">${uni.tuitionFee.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl">
                              <span className="text-sm font-medium text-gray-700">Established</span>
                              <span className="text-lg font-bold text-blue-600">{uni.establishedYear}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                    disabled={filters.page === 1}
                    className="px-5 py-3 bg-white border-2 border-gray-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-600 transition-all font-medium"
                  >
                    ← Previous
                  </button>
                  <div className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md">
                    Page {filters.page} of {pagination.totalPages}
                  </div>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                    disabled={filters.page === pagination.totalPages}
                    className="px-5 py-3 bg-white border-2 border-gray-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-600 transition-all font-medium"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Compare Modal */}
      {showCompareModal && selectedForCompare.length === 2 && (
        <CompareModal
          universities={getComparedUniversities}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
}

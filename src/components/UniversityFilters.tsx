'use client';

import { useState, useEffect } from 'react';
import UniversitySkeleton from './UniversitySkeleton';

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
    limit: 20
  });

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    fetchUniversities();
  }, [filters]);

  const fetchUniversities = async () => {
    setLoading(true);
    
    // Build query string
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.countries) params.append('countries', filters.countries);
    if (filters.region) params.append('region', filters.region);
    if (filters.minTuition) params.append('minTuition', filters.minTuition);
    if (filters.maxTuition) params.append('maxTuition', filters.maxTuition);
    if (filters.affordability.length) params.append('affordability', filters.affordability.join(','));
    if (filters.topTier) params.append('topTier', filters.topTier);
    if (filters.institutionAge.length) params.append('institutionAge', filters.institutionAge.join(','));
    if (filters.valueForMoney) params.append('valueForMoney', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());

    try {
      const response = await fetch(`/api?${params.toString()}`);
      const data = await response.json();
      setUniversities(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (field: 'affordability' | 'institutionAge', value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
      page: 1
    }));
  };

  const resetFilters = () => {
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
      limit: 20
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black placeholder:text-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Find Your Perfect University</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-blue-500 font-semibold">Filters</h2>
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search University</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                placeholder="e.g., Harvard"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Regions</option>
                <option value="north-america">North America</option>
                <option value="europe">Europe</option>
                <option value="asia-pacific">Asia Pacific</option>
                <option value="middle-east">Middle East</option>
                <option value="latin-america">Latin America</option>
                <option value="africa">Africa</option>
              </select>
            </div>

            {/* Tuition Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Tuition Range (USD)</label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={filters.minTuition}
                  onChange={(e) => setFilters({ ...filters, minTuition: e.target.value, page: 1 })}
                  placeholder="Min"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  value={filters.maxTuition}
                  onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value, page: 1 })}
                  placeholder="Max"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {/* Affordability */}
            <div>
              <label className="block text-sm font-medium mb-2">Affordability</label>
              <div className="space-y-2">
                {['budget', 'moderate', 'premium', 'luxury'].map(tier => (
                  <label key={tier} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.affordability.includes(tier)}
                      onChange={() => handleCheckboxChange('affordability', tier)}
                      className="mr-2"
                    />
                    <span className="capitalize">{tier}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Top Tier */}
            <div>
              <label className="block text-sm font-medium mb-2">Ranking</label>
              <select
                value={filters.topTier}
                onChange={(e) => setFilters({ ...filters, topTier: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Rankings</option>
                <option value="100">Top 100</option>
                <option value="200">Top 200</option>
                <option value="500">Top 500</option>
              </select>
            </div>

            {/* Institution Age */}
            <div>
              <label className="block text-sm font-medium mb-2">Institution Age</label>
              <div className="space-y-2">
                {['modern', 'established', 'historic', 'ancient'].map(age => (
                  <label key={age} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.institutionAge.includes(age)}
                      onChange={() => handleCheckboxChange('institutionAge', age)}
                      className="mr-2"
                    />
                    <span className="capitalize">{age}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Value for Money */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.valueForMoney}
                  onChange={(e) => setFilters({ ...filters, valueForMoney: e.target.checked, page: 1 })}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Best Value for Money</span>
              </label>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border rounded-md mb-2"
              >
                <option value="ranking">Ranking</option>
                <option value="tuitionFee">Tuition Fee</option>
                <option value="universityName">Name</option>
                <option value="establishedYear">Year Established</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <UniversitySkeleton />
              </>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Found {pagination.total} universities
                </div>
                
                <div className="space-y-4">
                  {universities.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                      <p className="text-gray-500 text-lg">No universities found matching your criteria.</p>
                      <button 
                        onClick={resetFilters}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    universities.map((uni) => (
                      <div key={uni._id} className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">{uni.universityName}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Location:</span> {uni.location}, {uni.country}
                          </div>
                          <div>
                            <span className="text-gray-600">Ranking:</span> #{uni.ranking}
                          </div>
                          <div>
                            <span className="text-gray-600">Tuition:</span> ${uni.tuitionFee.toLocaleString()}/year
                          </div>
                          <div>
                            <span className="text-gray-600">Established:</span> {uni.establishedYear}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex justify-center gap-2">
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                      disabled={filters.page === 1}
                      className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {filters.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                      disabled={filters.page === pagination.totalPages}
                      className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                      Next
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
}

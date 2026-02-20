import { NextResponse } from 'next/server';

import { Filter } from 'mongodb';
import { connect } from '../lib/dbConnect';

interface University {
  _id: string;
  universityName: string;
  country: string;
  location: string;
  tuitionFee: number;
  ranking: number;
  establishedYear: number;
}

const universityCollection = connect<University>('universityCollection');

// Helper function to calculate affordability tier
function getAffordabilityTier(tuitionFee: number): string {
  if (tuitionFee < 10000) return 'budget';
  if (tuitionFee < 25000) return 'moderate';
  if (tuitionFee < 50000) return 'premium';
  return 'luxury';
}

// Helper function to calculate institution age category
function getInstitutionAge(establishedYear: number): string {
  const currentYear = new Date().getFullYear();
  const age = currentYear - establishedYear;
  if (age < 50) return 'modern';
  if (age < 100) return 'established';
  if (age < 200) return 'historic';
  return 'ancient';
}

// Regional grouping for study abroad students
const REGIONAL_GROUPS: Record<string, string[]> = {
  'north-america': ['USA', 'Canada', 'Mexico'],
  'europe': ['UK', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Switzerland', 'Ireland', 'Belgium', 'Austria', 'Denmark', 'Norway', 'Finland', 'Poland'],
  'asia-pacific': ['Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore', 'China', 'Hong Kong', 'Taiwan', 'Malaysia', 'Thailand'],
  'middle-east': ['UAE', 'Saudi Arabia', 'Qatar', 'Israel', 'Turkey'],
  'latin-america': ['Brazil', 'Argentina', 'Chile', 'Colombia'],
  'africa': ['South Africa', 'Egypt', 'Kenya', 'Nigeria']
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Build MongoDB filter query
  const filter: Filter<University> = {};
  
  // BASIC FILTERS
  
  // Country filter (exact match or multiple countries)
  const countries = searchParams.get('countries');
  if (countries) {
    const countryList = countries.split(',').map(c => c.trim());
    filter.country = { $in: countryList };
  }
  
  // Location/City filter
  const location = searchParams.get('location');
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  
  // University name search
  const search = searchParams.get('search');
  if (search) {
    filter.universityName = { $regex: search, $options: 'i' };
  }
  
  // TUITION FEE FILTERS
  
  // Tuition range filter
  const minTuition = searchParams.get('minTuition');
  const maxTuition = searchParams.get('maxTuition');
  if (minTuition || maxTuition) {
    filter.tuitionFee = {};
    if (minTuition) filter.tuitionFee.$gte = parseFloat(minTuition);
    if (maxTuition) filter.tuitionFee.$lte = parseFloat(maxTuition);
  }
  
  // RANKING FILTERS
  
  // Ranking range filter
  const minRanking = searchParams.get('minRanking');
  const maxRanking = searchParams.get('maxRanking');
  if (minRanking || maxRanking) {
    filter.ranking = {};
    if (minRanking) filter.ranking.$gte = parseInt(minRanking);
    if (maxRanking) filter.ranking.$lte = parseInt(maxRanking);
  }
  
  // Top tier filter (top 100, 200, 500)
  const topTier = searchParams.get('topTier');
  if (topTier) {
    filter.ranking = { $lte: parseInt(topTier) };
  }
  
  // ESTABLISHED YEAR FILTERS
  
  const minYear = searchParams.get('minYear');
  const maxYear = searchParams.get('maxYear');
  if (minYear || maxYear) {
    filter.establishedYear = {};
    if (minYear) filter.establishedYear.$gte = parseInt(minYear);
    if (maxYear) filter.establishedYear.$lte = parseInt(maxYear);
  }
  
  // INNOVATIVE FILTERS
  
  // Regional filter (study abroad by region)
  const region = searchParams.get('region');
  if (region && REGIONAL_GROUPS[region]) {
    filter.country = { $in: REGIONAL_GROUPS[region] };
  }
  
  // Fetch data from MongoDB
  let results = await universityCollection.find(filter).toArray();
  
  // POST-QUERY FILTERS (Applied after fetching from DB)
  
  // Affordability tier filter
  const affordability = searchParams.get('affordability');
  if (affordability) {
    const tiers = affordability.split(',');
    results = results.filter(uni => 
      tiers.includes(getAffordabilityTier(uni.tuitionFee))
    );
  }
  
  // Institution age filter
  const institutionAge = searchParams.get('institutionAge');
  if (institutionAge) {
    const ages = institutionAge.split(',');
    results = results.filter(uni => 
      ages.includes(getInstitutionAge(uni.establishedYear))
    );
  }
  
  // Value for money filter (ranking vs tuition ratio)
  const valueForMoney = searchParams.get('valueForMoney');
  if (valueForMoney === 'true') {
    results = results.map(uni => ({
      ...uni,
      valueScore: uni.ranking > 0 ? (1000 - uni.ranking) / (uni.tuitionFee / 1000) : 0
    })).sort((a: any, b: any) => b.valueScore - a.valueScore);
  }
  
  // SORTING
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;
  
  if (sortBy) {
    results.sort((a, b) => {
      const aVal = a[sortBy as keyof University];
      const bVal = b[sortBy as keyof University];
      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });
  }
  
  // PAGINATION
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedResults = results.slice(startIndex, endIndex);
  
  return NextResponse.json({
    data: paginatedResults,
    pagination: {
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit)
    },
    filters: {
      applied: Object.keys(filter).length > 0 || affordability || institutionAge || valueForMoney,
      count: results.length
    }
  });
}

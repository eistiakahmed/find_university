'use client';

import { memo } from 'react';

interface University {
  _id: string;
  universityName: string;
  country: string;
  location: string;
  tuitionFee: number;
  ranking: number;
  establishedYear: number;
}

interface CompareModalProps {
  universities: University[];
  onClose: () => void;
}

const CompareModal = memo(function CompareModal({ universities, onClose }: CompareModalProps) {
  if (universities.length !== 2) return null;

  const [uni1, uni2] = universities;
  const currentYear = new Date().getFullYear();

  // Helper functions for comparison
  const getAffordabilityTier = (fee: number) => {
    if (fee < 10000) return 'Budget';
    if (fee < 25000) return 'Moderate';
    if (fee < 50000) return 'Premium';
    return 'Luxury';
  };

  const getInstitutionAge = (year: number) => {
    const age = currentYear - year;
    if (age < 50) return 'Modern';
    if (age < 100) return 'Established';
    if (age < 200) return 'Historic';
    return 'Ancient';
  };

  const calculateValueScore = (ranking: number, tuition: number) => {
    return ranking > 0 ? ((1000 - ranking) / (tuition / 1000)).toFixed(2) : '0';
  };

  // Comparison helpers
  const getBetterValue = (val1: number, val2: number, lowerIsBetter: boolean = false) => {
    if (val1 === val2) return 'equal';
    if (lowerIsBetter) {
      return val1 < val2 ? 'first' : 'second';
    }
    return val1 > val2 ? 'first' : 'second';
  };

  const getComparisonClass = (position: 'first' | 'second' | 'equal', current: 'first' | 'second') => {
    if (position === 'equal') return 'bg-gray-50';
    return position === current ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500' : 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-400';
  };

  const rankingComparison = getBetterValue(uni1.ranking, uni2.ranking, true);
  const tuitionComparison = getBetterValue(uni1.tuitionFee, uni2.tuitionFee, true);
  const ageComparison = getBetterValue(currentYear - uni1.establishedYear, currentYear - uni2.establishedYear);
  const valueScore1 = parseFloat(calculateValueScore(uni1.ranking, uni1.tuitionFee));
  const valueScore2 = parseFloat(calculateValueScore(uni2.ranking, uni2.tuitionFee));
  const valueComparison = getBetterValue(valueScore1, valueScore2);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">University Comparison</h2>
            <p className="text-blue-100 text-sm">Side-by-side analysis</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Comparison Content */}
          <div className="p-8">
            {/* University Names */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">{uni1.universityName}</h3>
                </div>
                <p className="text-sm text-blue-700 ml-13 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {uni1.location}, {uni1.country}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-purple-900">{uni2.universityName}</h3>
                </div>
                <p className="text-sm text-purple-700 ml-13 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {uni2.location}, {uni2.country}
                </p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="space-y-3">
              {/* World Ranking */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-bold text-gray-800 flex items-center gap-2 bg-gray-50 p-4 rounded-xl">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  World Ranking
                </div>
                <div className={`text-center py-4 rounded-xl ${getComparisonClass(rankingComparison, 'first')}`}>
                  <span className="text-3xl font-bold text-gray-900">#{uni1.ranking}</span>
                  {rankingComparison === 'first' && (
                    <span className="block text-xs text-green-700 mt-2 font-semibold">✓ Better Rank</span>
                  )}
                </div>
                <div className={`text-center py-4 rounded-xl ${getComparisonClass(rankingComparison, 'second')}`}>
                  <span className="text-3xl font-bold text-gray-900">#{uni2.ranking}</span>
                  {rankingComparison === 'second' && (
                    <span className="block text-xs text-green-700 mt-2 font-semibold">✓ Better Rank</span>
                  )}
                </div>
              </div>

              {/* Tuition Fee */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-bold text-gray-800 flex items-center gap-2 bg-gray-50 p-4 rounded-xl">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Annual Tuition
                </div>
                <div className={`text-center py-4 rounded-xl ${getComparisonClass(tuitionComparison, 'first')}`}>
                  <span className="text-3xl font-bold text-gray-900">${uni1.tuitionFee.toLocaleString()}</span>
                  <span className="block text-xs text-gray-600 mt-1 font-medium">{getAffordabilityTier(uni1.tuitionFee)}</span>
                  {tuitionComparison === 'first' && (
                    <span className="block text-xs text-green-700 mt-2 font-semibold">✓ More Affordable</span>
                  )}
                </div>
                <div className={`text-center py-4 rounded-xl ${getComparisonClass(tuitionComparison, 'second')}`}>
                  <span className="text-3xl font-bold text-gray-900">${uni2.tuitionFee.toLocaleString()}</span>
                  <span className="block text-xs text-gray-600 mt-1 font-medium">{getAffordabilityTier(uni2.tuitionFee)}</span>
                  {tuitionComparison === 'second' && (
                    <span className="block text-xs text-green-700 mt-2 font-semibold">✓ More Affordable</span>
                  )}
                </div>
              </div>

              {/* Cost Difference */}
              <div className="grid grid-cols-3 gap-4 items-center bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border-2 border-amber-200">
                <div className="font-bold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  Cost Difference
                </div>
                <div className="text-center py-2 col-span-2">
                  <span className="text-2xl font-bold text-orange-700">
                    ${Math.abs(uni1.tuitionFee - uni2.tuitionFee).toLocaleString()}
                  </span>
                  <span className="block text-xs text-orange-600 mt-1 font-medium">
                    {uni1.tuitionFee < uni2.tuitionFee 
                      ? `${uni1.universityName} is cheaper`
                      : uni1.tuitionFee > uni2.tuitionFee
                      ? `${uni2.universityName} is cheaper`
                      : 'Same cost'}
                  </span>
                </div>
              </div>

              {/* Established Year */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-bold text-gray-800 flex items-center gap-2 bg-gray-50 p-4 rounded-xl">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Established
                </div>
                <div className={`text-center py-4 rounded-xl ${getComparisonClass(ageComparison, 'first')}`}>
                  <span className="text-3xl font-bold text-gray-900">{uni1.establishedYear}</span>
                  <span className="block text-xs text-gray-600 mt-1 font-medium">
                    {getInstitutionAge(uni1.establishedYear)} ({currentYear - uni1.establishedYear} years)
                  </span>
                </div>
                <div className={`text-center py-4 rounded-xl ${getComparisonClass(ageComparison, 'second')}`}>
                  <span className="text-3xl font-bold text-gray-900">{uni2.establishedYear}</span>
                  <span className="block text-xs text-gray-600 mt-1 font-medium">
                    {getInstitutionAge(uni2.establishedYear)} ({currentYear - uni2.establishedYear} years)
                  </span>
                </div>
              </div>

              {/* Value Score */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-bold text-gray-800 flex items-center gap-2 bg-gray-50 p-4 rounded-xl">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    Value Score
                    <span className="block text-xs text-gray-500 font-normal">Ranking vs Cost</span>
                  </div>
                </div>
                <div className={`text-center py-4 rounded-xl ${getComparisonClass(valueComparison, 'first')}`}>
                  <span className="text-3xl font-bold text-gray-900">{valueScore1}</span>
                  {valueComparison === 'first' && (
                    <span className="block text-xs text-green-700 mt-2 font-semibold">✓ Better Value</span>
                  )}
                </div>
                <div className={`text-center py-4 rounded-xl ${getComparisonClass(valueComparison, 'second')}`}>
                  <span className="text-3xl font-bold text-gray-900">{valueScore2}</span>
                  {valueComparison === 'second' && (
                    <span className="block text-xs text-green-700 mt-2 font-semibold">✓ Better Value</span>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
              <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Quick Summary
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl">
                  <p className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">1</span>
                    {uni1.universityName}
                  </p>
                  <ul className="space-y-2 text-sm">
                    {rankingComparison === 'first' && (
                      <li className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Better world ranking
                      </li>
                    )}
                    {tuitionComparison === 'first' && (
                      <li className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        More affordable
                      </li>
                    )}
                    {valueComparison === 'first' && (
                      <li className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Better value for money
                      </li>
                    )}
                    {ageComparison === 'first' && (
                      <li className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Longer history
                      </li>
                    )}
                    {rankingComparison !== 'first' && tuitionComparison !== 'first' && valueComparison !== 'first' && ageComparison !== 'first' && (
                      <li className="text-gray-500 italic">No advantages</li>
                    )}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <p className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">2</span>
                    {uni2.universityName}
                  </p>
                  <ul className="space-y-2 text-sm">
                    {rankingComparison === 'second' && (
                      <li className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Better world ranking
                      </li>
                    )}
                    {tuitionComparison === 'second' && (
                      <li className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        More affordable
                      </li>
                    )}
                    {valueComparison === 'second' && (
                      <li className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Better value for money
                      </li>
                    )}
                    {ageComparison === 'second' && (
                      <li className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Longer history
                      </li>
                    )}
                    {rankingComparison !== 'second' && tuitionComparison !== 'second' && valueComparison !== 'second' && ageComparison !== 'second' && (
                      <li className="text-gray-500 italic">No advantages</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded"></div>
                <span className="text-gray-700 font-medium">Better</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-400 rounded"></div>
                <span className="text-gray-700 font-medium">Worse</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-50 rounded"></div>
                <span className="text-gray-700 font-medium">Equal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200 px-8 py-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
});

export default CompareModal;

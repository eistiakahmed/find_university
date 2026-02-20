import UniversitySkeleton from '@/components/UniversitySkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded-lg w-96 mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <UniversitySkeleton />
      </div>
    </div>
  );
}

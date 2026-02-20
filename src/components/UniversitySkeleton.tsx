export default function UniversitySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-transparent animate-pulse">
          <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300"></div>
          
          <div className="p-6">
            {/* Title and button skeleton */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Info cards skeleton */}
            <div className="space-y-3">
              <div className="p-3 bg-gray-100 rounded-xl">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

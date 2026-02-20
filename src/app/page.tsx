import { Suspense } from 'react';
import UniversityFilters from "@/components/UniversityFilters";
import UniversitySkeleton from "@/components/UniversitySkeleton";

export const metadata = {
  title: "University Search | Find Your Perfect University",
  description: "Search and compare universities by ranking, tuition, location, and more.",
};

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8"><UniversitySkeleton /></div>}>
      <UniversityFilters />
    </Suspense>
  );
}

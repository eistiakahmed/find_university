#  University Finder - Advanced Search & Comparison Platform

A highly optimized, modern web application for discovering and comparing universities worldwide. Built with Next.js 16, featuring server-side filtering, intelligent search, and comprehensive comparison tools.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![MongoDB](https://img.shields.io/badge/MongoDB-7.1-green)

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/eistiakahmed/find_university)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?logo=vercel)](https://find-university-eight.vercel.app/)

##  Live Demo

**[View Live Application](https://find-university-eight.vercel.app/)** 

🔗 https://find-university-eight.vercel.app/

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Performance Optimizations](#performance-optimizations)
- [API Documentation](#api-documentation)
- [Developer](#developer)

##  Features

### Core Functionality
-  **Advanced Search** - Real-time university search with debouncing
-  **Regional Filtering** - Filter by geographic regions (North America, Europe, Asia-Pacific, etc.)
-  **Tuition Range** - Flexible min/max tuition fee filtering
-  **Ranking Tiers** - Filter by Top 100, 200, or 500 universities
-  **Established Year** - Filter by institution age and history
-  **Smart Filters** - Affordability tiers, institution age categories, value for money

### Innovative Features
-  **Compare Universities** - Side-by-side comparison of 2 universities
-  **Value Score** - Intelligent ranking vs cost analysis
-  **Affordability Tiers** - Budget, Moderate, Premium, Luxury categories
-  **Institution Age** - Modern, Established, Historic, Ancient classifications
-  **Multi-criteria Sorting** - Sort by ranking, tuition, name, or year

### User Experience
-  **Modern UI** - Professional gradient design with smooth animations
-  **Fully Responsive** - Mobile-first design, works on all devices
-  **Lightning Fast** - Optimized with caching, memoization, and code splitting
-  **Loading States** - Skeleton screens for better perceived performance
-  **Error Handling** - Graceful error boundaries with retry functionality
-  **Accessible** - WCAG compliant with keyboard navigation support

## Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB 7.1** - NoSQL database for university data
- **Server-Side Filtering** - All filtering logic on backend

### Performance & SEO
- **React.memo** - Component memoization
- **useCallback/useMemo** - Hook optimization
- **Debouncing** - Search input optimization
- **API Caching** - 60s cache with stale-while-revalidate
- **Code Splitting** - Automatic with Suspense
- **SEO Optimized** - Meta tags, Open Graph, sitemap, robots.txt
- **PWA Ready** - Progressive Web App capabilities

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eistiakahmed/find_university.git
   cd find_university
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_BASE_URL=https://find-university-eight.vercel.app
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
find_university/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── route.ts          # API endpoint with filtering logic
│   │   ├── lib/
│   │   │   └── dbConnect.ts      # MongoDB connection
│   │   ├── universities/
│   │   │   └── page.tsx          # Universities page
│   │   ├── error.tsx             # Error boundary
│   │   ├── loading.tsx           # Loading state
│   │   ├── layout.tsx            # Root layout with SEO
│   │   ├── page.tsx              # Home page
│   │   ├── robots.ts             # Robots.txt generation
│   │   ├── sitemap.ts            # Sitemap generation
│   │   ├── manifest.ts           # PWA manifest
│   │   └── globals.css           # Global styles
│   └── components/
│       ├── UniversityFilters.tsx # Main filter component
│       ├── CompareModal.tsx      # Comparison modal
│       └── UniversitySkeleton.tsx # Loading skeleton
├── public/                        # Static assets
├── .env.example                   # Environment variables template
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

## Key Features

### 1. Server-Side Filtering
All filtering logic happens on the backend for:
- Better performance
- Security
- Scalability
- SEO benefits

### 2. Innovative Filters

#### Regional Grouping
Groups countries by study abroad regions:
- North America (USA, Canada, Mexico)
- Europe (UK, Germany, France, etc.)
- Asia-Pacific (Australia, Japan, Singapore, etc.)
- Middle East, Latin America, Africa

#### Affordability Tiers
Intelligent categorization based on tuition:
- Budget: < $10,000
- Moderate: $10,000 - $25,000
- Premium: $25,000 - $50,000
- Luxury: > $50,000

#### Institution Age
Historical context:
- Modern: < 50 years
- Established: 50-100 years
- Historic: 100-200 years
- Ancient: > 200 years

#### Value for Money
Calculates ranking vs cost ratio to find best value universities

### 3. Compare Universities
- Select any 2 universities
- Side-by-side comparison modal
- Visual indicators for better/worse metrics
- Cost difference calculation
- Value score comparison
- Quick summary of advantages

## Performance Optimizations

### Frontend Optimizations
- **Debounced Search**: 500ms delay to reduce API calls
- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Memoizes event handlers
- **useMemo**: Caches computed values
- **Code Splitting**: Automatic with Next.js
- **Font Optimization**: next/font with display swap

### Backend Optimizations
- **API Caching**: 60s cache + 120s stale-while-revalidate
- **Efficient Queries**: Optimized MongoDB queries
- **Pagination**: Limits data transfer
- **Error Handling**: Try-catch blocks throughout

### Build Optimizations
- **Compression**: Enabled in next.config
- **Image Optimization**: AVIF/WebP formats
- **Tree Shaking**: Automatic dead code elimination
- **Minification**: Production builds minified

## API Documentation

### GET `/api`

Fetch universities with filters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search university name |
| `countries` | string | Comma-separated country list |
| `region` | string | Region filter (north-america, europe, etc.) |
| `minTuition` | number | Minimum tuition fee |
| `maxTuition` | number | Maximum tuition fee |
| `topTier` | number | Top ranking tier (100, 200, 500) |
| `affordability` | string | Comma-separated tiers (budget, moderate, etc.) |
| `institutionAge` | string | Comma-separated ages (modern, established, etc.) |
| `valueForMoney` | boolean | Filter by value score |
| `sortBy` | string | Sort field (ranking, tuitionFee, etc.) |
| `sortOrder` | string | Sort order (asc, desc) |
| `page` | number | Page number |
| `limit` | number | Results per page |

**Response:**

```json
{
  "data": [
    {
      "_id": "...",
      "universityName": "Harvard University",
      "country": "USA",
      "location": "Cambridge, Massachusetts",
      "tuitionFee": 54002,
      "ranking": 1,
      "establishedYear": 1636
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  },
  "filters": {
    "applied": true,
    "count": 100
  }
}
```

## UI/UX Highlights

- **Gradient Design**: Modern blue-to-indigo gradients
- **Card-Based Layout**: Clean, organized university cards
- **Visual Feedback**: Hover states, transitions, animations
- **Color-Coded Metrics**: Easy-to-scan information
- **Responsive Grid**: Adapts from 1 to 3 columns
- **Skeleton Screens**: Smooth loading experience
- **Error States**: User-friendly error messages

## Performance Metrics

Expected Lighthouse scores:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

## Security

- Environment variables for sensitive data
- Server-side validation
- Error handling without exposing internals
- No client-side secrets

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel deploy
```

### Other Platforms

Build the project:
```bash
npm run build
```

Deploy the `.next` folder with your hosting provider.

## Environment Variables

Required variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Application URL (for SEO)
NEXT_PUBLIC_BASE_URL=https://find-university-eight.vercel.app
```

##  Testing

Run Lighthouse audit:
```bash
npm run build
npm start
npx lighthouse http://localhost:3000 --view
```

## Documentation

Additional documentation:
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization details
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md) - Optimization summary
- [REQUIREMENTS_CHECKLIST.md](./REQUIREMENTS_CHECKLIST.md) - Requirements verification

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

##  Developer

**Eistiak Ahmed**

Full Stack Developer | MERN Stack Specialist

- Email: [eistiakahmedmeraj@gmail.com](mailto:eistiakahmedmeraj@gmail.com)
-  Phone: +880 1560064883
-  Portfolio: [https://eistiakahmed.netlify.app/](https://eistiakahmed.netlify.app/)
-  GitHub: [https://github.com/eistiakahmed](https://github.com/eistiakahmed)
-  LinkedIn: [https://www.linkedin.com/in/eistiak-ahmed/](https://www.linkedin.com/in/eistiak-ahmed/)

---

##  Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for the database solution
- Tailwind CSS for the styling framework

---

**Built with ❤️ by Eistiak Ahmed**

*If you found this project helpful, please consider giving it a ⭐ on GitHub!*

# Flood Dash Exporter

A modern data dashboard built with Next.js, featuring a clean UI for displaying and exporting data from Supabase.

## ✨ Features

- 🔄 **Real-time Data Grid** - Display data with dynamic columns and auto-refresh
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🏗️ **Vertical Slice Architecture** - Organized, maintainable codebase
- 📊 **Data Export** - Export functionality ready to implement
- 🔍 **Filtering** - Extensible filtering system
- 🌐 **API Integration** - Pre-configured Supabase API client

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (optional):

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://cynwvkagfmhlpsvkparv.supabase.co/functions/v1/public-data-api
NEXT_PUBLIC_API_KEY=<APIKEY>
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the dashboard

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](./docs/README.md) directory:

- **[API Setup Guide](./docs/api/API_SETUP.md)** - Get started with the API integration
- **[API Library Docs](./docs/api/LIB_DOCUMENTATION.md)** - Complete API client reference
- **[Data Grid Feature](./docs/features/DATA_GRID.md)** - Vertical slice architecture example
- **[UI Components](./docs/COMPONENTS.md)** - Available shadcn/ui components

## 🏗️ Project Structure

```
flood-dash-exporter/
├── app/                    # Next.js app directory
├── components/             # Shared UI components
│   └── ui/                # shadcn/ui components
├── features/              # Feature modules (Vertical Slices)
│   └── data-grid/        # Data grid feature
├── lib/                   # Utilities and API client
├── docs/                  # Documentation
└── public/               # Static assets
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

This project uses Vertical Slice Architecture. When adding new features:

1. Create a new feature directory under `features/`
2. Keep all feature-related code self-contained
3. See [Data Grid](./docs/features/DATA_GRID.md) for a complete example

## 📄 License

This project is private and proprietary.


# Wolfsnack - Sales & Orders Management System

A modern, full-featured web application for managing sales and orders for a small business. Built with React, TypeScript, and Vite to demonstrate proficiency in modern React development practices.

## 🎯 Project Overview

This application serves as a comprehensive business management tool for tracking customers, products, sales, and orders. It features a clean, intuitive interface designed for daily operational use while showcasing advanced React patterns and best practices.

This is the frontend application of a full-stack solution. The backend API is available at [wolfsnacks-api](https://github.com/wencel/wolfsnacks-api).

## ✨ Features

### Core Functionality

- **Customer Management**: Create, view, edit, and manage customer information
- **Product Management**: Track products with details, types, and presentations
- **Sales Management**: Record and manage sales transactions
- **Order Tracking**: Monitor and manage business orders
- **Authentication**: Secure login system with protected routes
- **Search & Filtering**: Advanced search and filter capabilities across all entities

### Technical Highlights

- **Atomic Design Pattern**: Component architecture following Atoms → Molecules → Organisms hierarchy
- **State Management**: Redux Toolkit for centralized state management
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Custom Hooks**: Reusable hooks for data fetching, authentication, and UI state
- **Responsive Design**: Mobile-first approach with SASS modules
- **Testing**: Comprehensive test coverage with Vitest and React Testing Library
- **Error Handling**: Robust error handling with user-friendly feedback
- **Loading States**: Thoughtful loading indicators and skeleton screens

## 🛠️ Tech Stack

### Core

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing

### State Management & Data

- **Redux Toolkit** - State management
- **React Redux** - React bindings for Redux
- **Axios** - HTTP client
- **Ramda** - Functional utilities

### UI & Styling

- **SASS/SCSS** - CSS preprocessing with modules
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Radix UI** - Accessible UI primitives
- **React Date Picker** - Date selection components
- **React Number Format** - Number formatting

### Development Tools

- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting

## 📁 Project Structure

```
src/
├── components/
│   ├── Atoms/          # Basic building blocks (Button, Input, Card, etc.)
│   ├── Molecules/      # Composite components (SearchField, CustomerCard, etc.)
│   ├── Organisms/      # Complex components (Modal, Navbar, FilterModals, etc.)
│   ├── Guards/         # Route protection components
│   ├── Layout/         # Layout components
│   └── Providers/      # Context providers (Auth, Toast)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components
├── store/              # Redux store and slices
├── styles/             # Global styles
└── test/               # Test utilities and setup
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see [wolfsnacks-api](https://github.com/wencel/wolfsnacks-api))

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd wolfsnack-vite
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

4. Ensure the backend API is running (see [wolfsnacks-api](https://github.com/wencel/wolfsnacks-api) for setup instructions)

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🏗️ Architecture Decisions

### Atomic Design

Components are organized using the Atomic Design methodology:

- **Atoms**: Basic, reusable UI elements (Button, Input, Label)
- **Molecules**: Simple combinations of atoms (SearchField, CustomerCard)
- **Organisms**: Complex UI sections (Modal, Navbar, FilterModals)

### State Management

Redux Toolkit is used for:

- Global application state
- API data caching
- Authentication state
- Loading and error states

### Custom Hooks

Reusable hooks encapsulate business logic:

- `useAuth` - Authentication management
- `useCustomers` - Customer data operations
- `useProducts` - Product data operations
- `useSales` - Sales data operations
- `useError` - Error handling
- `useLoading` - Loading state management

### Route Protection

- `ProtectedRoute` - Requires authentication
- `PublicRoute` - Only accessible when not authenticated

## 🎨 Styling Approach

- **SASS Modules**: Scoped styles using CSS Modules
- **Mobile-First**: Responsive design starting from mobile breakpoints
- **Component-Scoped**: Each component has its own style file
- **Global Styles**: Shared styles in `styles.global.sass`

## 🔒 Security Considerations

- Protected routes require authentication
- API calls include authentication headers
- Input validation on forms
- Error messages don't expose sensitive information

## 🔌 Backend API

This frontend application communicates with a separate backend API. The API repository and documentation can be found at:

**[wolfsnacks-api](https://github.com/wencel/wolfsnacks-api)**

Make sure to:

1. Clone and set up the backend API repository
2. Start the API server (typically runs on port 3001)
3. Configure the `VITE_API_URL` environment variable to point to your API endpoint

## 📦 Key Dependencies

See `package.json` for the complete list. Notable dependencies:

- React ecosystem (React, React DOM, React Router)
- Redux Toolkit for state management
- Axios for API communication
- Vitest for testing
- SASS for styling

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📄 License

Private project - All rights reserved

## 👨‍💻 Author

Built as a showcase of React proficiency and modern web development practices.

---

## 🔗 Related Repositories

- **Backend API**: [wolfsnacks-api](https://github.com/wencel/wolfsnacks-api)

**Note**: This application requires the backend API to function. Ensure the API server is running and configured with the correct `VITE_API_URL` environment variable. See the [wolfsnacks-api](https://github.com/wencel/wolfsnacks-api) repository for backend setup instructions.

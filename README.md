# 🚚 Transportation Management System (TMS)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-API-E10098.svg)](https://graphql.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, full-stack Transportation Management System built with React, Node.js, GraphQL, and Apollo Client.

## 🎥 Live Demo

- **Frontend**: [Your Deployed Frontend URL]
- **Backend API**: [Your Deployed Backend URL]
- **GraphQL Playground**: [Your Backend URL]/graphql

## ✨ Features Showcase

### Backend (GraphQL API)
- ✅ **GraphQL API** with Apollo Server v4
- ✅ **JWT Authentication** with role-based access (Admin/Employee)
- ✅ **12 Pre-populated Shipments** with realistic dummy data
- ✅ **Cursor-based Pagination** for efficient data loading
- ✅ **Advanced Filtering** by status, carrier, and search terms
- ✅ **Sorting** by multiple fields (date, rate, etc.)
- ✅ **DataLoader** for performance optimization
- ✅ **Comprehensive Error Handling**
- ✅ **CORS Enabled** for cross-origin requests

### Frontend (React SPA)
- ✅ **Beautiful Modern UI** with gradient design and animations
- ✅ **Responsive Layout** (mobile, tablet, desktop)
- ✅ **Hamburger Menu** with one-level deep submenu navigation
- ✅ **Horizontal Menu** with quick status filters
- ✅ **Grid View** - Professional 10-column table layout
- ✅ **Tile View** - Beautiful card-based layout
- ✅ **Bun Button** with actions menu (edit, flag, delete)
- ✅ **Expandable Detail Modal** with complete shipment information
- ✅ **Real-time Search** across all shipment fields
- ✅ **Advanced Filters** by status and carrier
- ✅ **Admin Dashboard** with statistics cards
- ✅ **Pagination** controls for large datasets

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   React SPA     │ ◄─────► │   GraphQL API    │
│   (Frontend)    │   HTTP  │    (Backend)     │
│                 │         │                  │
│ - React 18      │         │ - Node.js        │
│ - Apollo Client │         │ - Apollo Server  │
│ - Vite          │         │ - Express        │
│ - React Router  │         │ - JWT Auth       │
└─────────────────┘         └──────────────────┘
```

## 📦 Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express | Web framework |
| Apollo Server | GraphQL server |
| GraphQL | API query language |
| JWT | Authentication |
| bcryptjs | Password hashing |
| DataLoader | Query optimization |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Apollo Client | GraphQL client |
| React Router | Routing |
| Lucide React | Icon library |
| CSS3 | Custom styling |

## 🚀 Quick Start

### Prerequisites
```bash
node --version  # v18 or higher
npm --version   # v8 or higher
```

### Installation & Running

**1. Clone the repository:**
```bash
git clone https://github.com/lokeshkagrawal/TransportManagementSystem.git
cd tms-app
```

**2. Start Backend:**
```bash
cd backend
npm install
npm start
```
✅ Backend runs at `http://localhost:4000`

**3. Start Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend runs at `http://localhost:3000`

**4. Login:**
- Navigate to `http://localhost:3000`
- Use demo credentials (see below)

## 🔑 Demo Credentials

### Admin Account
- **Email**: `admin@tms.com`
- **Password**: `admin123`
- **Access**: Full system access, view all shipments, statistics, bulk operations

### Employee Account
- **Email**: `employee@tms.com`
- **Password**: `employee123`
- **Access**: View and manage own shipments only

## 🌐 Deployment Instructions

### Step 1: Deploy Backend

#### Render.com (Recommended - Free tier available)
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `tms-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Click "Create Web Service"
6. Copy your backend URL (e.g., `https://transportmanagementsystem-308r.onrender.com/`)

#### Heroku (Alternative)
```bash
cd backend
heroku login
heroku create your-tms-backend
git init
git add .
git commit -m "Initial commit"
git push heroku main
heroku open
```

#### Railway (Alternative)
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

### Step 2: Deploy Frontend

#### Netlify (Recommended - Free tier available)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variable:
   - **Key**: `VITE_GRAPHQL_URL`
   - **Value**: Your backend URL + `/graphql` (e.g., `https://tms-backend-xxx.onrender.com/graphql`)
6. Click "Deploy site"
7. Your app will be live at `https://transportmanagesystem.netlify.app/`

#### Vercel (Alternative)
```bash
cd frontend
npm install -g vercel
vercel
# Follow prompts and set VITE_GRAPHQL_URL environment variable
```

### Step 3: Test Your Deployment
1. Visit your frontend URL
2. Login with demo credentials
3. Verify all features work (grid view, tile view, filters, search)
4. Test CRUD operations

## 📚 API Documentation

### Authentication

**Login:**
```graphql
mutation Login {
  login(email: "admin@tms.com", password: "admin123") {
    token
    user {
      id
      name
      role
    }
  }
}
```

Add token to headers:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Queries

**Get All Shipments with Pagination:**
```graphql
query GetShipments {
  shipments(
    first: 10
    filter: { status: IN_TRANSIT }
    sort: { field: "rate", order: DESC }
  ) {
    edges {
      node {
        id
        trackingNumber
        shipperName
        carrierName
        status
        rate
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

**Get Single Shipment:**
```graphql
query GetShipment {
  shipment(id: "1") {
    id
    trackingNumber
    shipperName
    carrierName
    pickupLocation {
      city
      state
    }
    deliveryLocation {
      city
      state
    }
  }
}
```

### Mutations

**Create Shipment:**
```graphql
mutation CreateShipment {
  createShipment(
    input: {
      shipperName: "New Shipper"
      carrierName: "FedEx"
      pickupLocation: {
        address: "123 Main St"
        city: "Seattle"
        state: "WA"
        zipCode: "98101"
        country: "USA"
      }
      deliveryLocation: {
        address: "456 Oak Ave"
        city: "Portland"
        state: "OR"
        zipCode: "97201"
        country: "USA"
      }
      trackingNumber: "TRK999999"
      status: PENDING
      rate: 500.00
      weight: 100.0
      dimensions: {
        length: 48
        width: 40
        height: 36
        unit: "inches"
      }
      estimatedDelivery: "2026-02-15T10:00:00Z"
    }
  ) {
    id
    trackingNumber
  }
}
```

**Update Shipment:**
```graphql
mutation UpdateShipment {
  updateShipment(
    id: "1"
    input: {
      status: DELIVERED
      actualDelivery: "2026-01-27T14:30:00Z"
    }
  ) {
    id
    status
  }
}
```

## 🎨 UI Features

### Grid View (Table)
- 10 columns showing complete shipment data
- Sortable columns
- Status badges with color coding
- Click row to view details
- Responsive horizontal scrolling

### Tile View (Cards)
- Beautiful card layout
- Essential information at a glance
- Bun button (⋮) for actions:
  - Edit shipment
  - Flag for review
  - Delete shipment
- Click card to expand details
- Responsive grid (1-4 columns)

### Detail Modal
- Comprehensive shipment information
- Organized into sections:
  - Tracking Information
  - Location Details
  - Shipment Details (weight, dimensions)
  - Timeline
  - Notes
- Easy close/back navigation

### Filters & Search
- **Search**: Real-time across all fields
- **Status Filter**: All, Pending, In Transit, Delivered, Cancelled
- **Carrier Filter**: All, FedEx, UPS, DHL, etc.
- **Sort Options**: Date (latest/oldest), Rate (high/low)

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control
- Protected routes
- Input validation
- CORS configuration
- XSS prevention

## ⚡ Performance Optimizations

### Backend
- **DataLoader**: Batch and cache user lookups
- **Cursor Pagination**: Efficient large dataset handling
- **Field Resolvers**: Only compute requested fields
- **In-Memory Caching**: Fast data access

### Frontend
- **Apollo Cache**: Reduce redundant API calls
- **Lazy Loading**: Load components on demand
- **Optimized Bundles**: Tree-shaking with Vite
- **Debounced Search**: Reduce API calls
- **CSS Optimization**: Minimal external dependencies

## 📂 Project Structure

```
tms-app/
├── backend/
│   ├── server.js          # Apollo Server + Express
│   ├── schema.js          # GraphQL type definitions
│   ├── resolvers.js       # Query/mutation resolvers
│   ├── database.js        # Mock data & CRUD operations
│   ├── auth.js            # JWT utilities
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx       # Main app layout
    │   │   ├── Login.jsx           # Auth page
    │   │   ├── GridView.jsx        # Table view
    │   │   ├── TileView.jsx        # Card view
    │   │   ├── ShipmentDetail.jsx  # Detail modal
    │   │   └── StatsCards.jsx      # Admin stats
    │   ├── App.jsx                 # Router setup
    │   ├── App.css                 # Global styles
    │   ├── apollo-client.js        # GraphQL client
    │   ├── graphql.js              # Queries/mutations
    │   └── main.jsx                # Entry point
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── README.md
```

## 🧪 Testing Locally

1. **Start both servers** (backend on :4000, frontend on :3000)
2. **Test authentication**:
   - Login as admin and employee
   - Verify role-based access
3. **Test views**:
   - Switch between grid and tile
   - Click shipment to see details
4. **Test filters**:
   - Search for tracking numbers
   - Filter by status and carrier
5. **Test actions**:
   - Edit shipment (bun menu)
   - Delete shipment
   - Verify data updates

## 📝 Environment Variables

### Backend `.env`
```env
PORT=4000
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=production
```

### Frontend `.env`
```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
# For production, update to your deployed backend:
# VITE_GRAPHQL_URL=https://your-backend.onrender.com/graphql
```

## 🎯 Test Requirements Checklist

- ✅ GraphQL API (Node.js)
- ✅ Shipment data model with all required fields
- ✅ Queries: list with filters, single shipment, pagination
- ✅ Mutations: add, update, delete
- ✅ Authentication & role-based authorization
- ✅ Performance optimization (DataLoader)
- ✅ React frontend
- ✅ Hamburger menu with submenu
- ✅ Horizontal menu
- ✅ Grid view (10 columns)
- ✅ Tile view
- ✅ Bun button with actions
- ✅ Expandable detail view
- ✅ Beautiful, professional design
- ✅ Responsive layout
- ✅ Dummy data (12 shipments)
- ✅ Deployed live URL
- ✅ GitHub repository
- ✅ Complete documentation

## 🚀 Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Environment variables configured
- [ ] CORS properly set up
- [ ] Test login functionality
- [ ] Test all CRUD operations
- [ ] Verify mobile responsiveness
- [ ] Check all features work
- [ ] Share URLs for review

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the detailed README in backend/ and frontend/ folders

## 📄 License

MIT

---

**Built with ❤️ for the TMS Test Project**

*Ready for deployment and demonstration!*

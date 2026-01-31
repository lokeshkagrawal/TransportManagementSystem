# TMS Backend - GraphQL API

## Overview
A production-ready GraphQL API for Transportation Management System built with Node.js, Apollo Server, and Express.

## Features
- ✅ GraphQL API with queries and mutations
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/Employee)
- ✅ Pagination with cursor-based navigation
- ✅ Filtering and sorting capabilities
- ✅ DataLoader for performance optimization
- ✅ Comprehensive error handling
- ✅ CORS enabled for cross-origin requests

## Tech Stack
- Node.js
- Apollo Server v4
- Express.js
- GraphQL
- JWT (jsonwebtoken)
- bcryptjs
- DataLoader

## Installation

```bash
npm install
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start at: `http://localhost:4000`

## Default Credentials

### Admin Account
- Email: `admin@tms.com`
- Password: `admin@123`

### Employee Account
- Email: `employee@tms.com`
- Password: `employee@123`

## GraphQL API Endpoints

### Authentication

#### Login
```graphql
mutation Login {
  login(email: "admin@tms.com", password: "admin@123") {
    token
    user {
      id
      email
      name
      role
    }
  }
}
```

#### Register
```graphql
mutation Register {
  register(
    email: "newuser@tms.com"
    password: "password123"
    name: "New User"
    role: EMPLOYEE
  ) {
    token
    user {
      id
      email
      name
      role
    }
  }
}
```

### Shipment Queries

#### Get All Shipments (with pagination)
```graphql
query GetShipments {
  shipments(first: 10) {
    edges {
      node {
        id
        trackingNumber
        shipperName
        carrierName
        status
        rate
        estimatedDelivery
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

#### Filter Shipments
```graphql
query FilterShipments {
  shipments(
    filter: {
      status: IN_TRANSIT
      carrierName: "FedEx"
    }
    first: 10
  ) {
    edges {
      node {
        id
        trackingNumber
        status
      }
    }
  }
}
```

#### Sort Shipments
```graphql
query SortShipments {
  shipments(
    sort: {
      field: "rate"
      order: DESC
    }
    first: 10
  ) {
    edges {
      node {
        id
        rate
        trackingNumber
      }
    }
  }
}
```

#### Get Single Shipment
```graphql
query GetShipment {
  shipment(id: "1") {
    id
    trackingNumber
    shipperName
    carrierName
    pickupLocation {
      address
      city
      state
    }
    deliveryLocation {
      address
      city
      state
    }
    status
    rate
    weight
    dimensions {
      length
      width
      height
      unit
    }
    createdBy {
      name
      email
    }
  }
}
```

### Shipment Mutations

#### Create Shipment
```graphql
mutation CreateShipment {
  createShipment(
    input: {
      shipperName: "Test Shipper"
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
    status
  }
}
```

#### Update Shipment
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
    actualDelivery
  }
}
```

#### Delete Shipment
```graphql
mutation DeleteShipment {
  deleteShipment(id: "1")
}
```

### Admin-Only Queries

#### Shipment Statistics
```graphql
query GetStats {
  shipmentStats {
    totalShipments
    pendingShipments
    inTransitShipments
    deliveredShipments
    totalRevenue
    averageRate
  }
}
```

#### Bulk Update Status (Admin Only)
```graphql
mutation BulkUpdate {
  bulkUpdateStatus(
    ids: ["1", "2", "3"]
    status: IN_TRANSIT
  ) {
    id
    status
  }
}
```

## Authentication

All queries and mutations (except login and register) require authentication.

### Adding Auth Token to Requests

In GraphQL Playground:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

In JavaScript:
```javascript
const response = await fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ query, variables })
});
```

## Authorization Rules

### Admin Role
- Can view all shipments
- Can create, update, delete any shipment
- Can view shipment statistics
- Can perform bulk operations

### Employee Role
- Can view only their own shipments
- Can create new shipments
- Can update/delete only their own shipments
- Cannot view statistics
- Cannot perform bulk operations

## Performance Optimizations

1. **DataLoader**: Batch and cache database requests for user lookups
2. **Cursor-based Pagination**: Efficient pagination for large datasets
3. **Field Filtering**: Only requested fields are resolved
4. **Indexed Filtering**: Optimized filter operations

## Error Handling

The API returns structured errors with:
- `message`: Human-readable error message
- `code`: Error code for client-side handling
- `path`: GraphQL field path where error occurred

## Environment Variables

Create a `.env` file:
```
PORT=4000
JWT_SECRET=your-super-secret-key
NODE_ENV=production
```

## Deployment

### Heroku
```bash
heroku create your-tms-api
git push heroku main
```

### Render
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### AWS/GCP
Deploy as a containerized application or serverless function.

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(email:\"admin@tms.com\", password:\"admin@123\") { token user { name role } } }"}'

# Get Shipments (with token)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"query { shipments(first: 5) { edges { node { id trackingNumber } } } }"}'
```

## License
MIT

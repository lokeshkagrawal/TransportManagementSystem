export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    role: Role!
  }

  enum Role {
    ADMIN
    EMPLOYEE
  }

  enum ShipmentStatus {
    PENDING
    IN_TRANSIT
    DELIVERED
    CANCELLED
  }

  type Shipment {
    id: ID!
    shipperName: String!
    carrierName: String!
    pickupLocation: Location!
    deliveryLocation: Location!
    trackingNumber: String!
    status: ShipmentStatus!
    rate: Float!
    weight: Float!
    dimensions: Dimensions!
    estimatedDelivery: String!
    actualDelivery: String
    notes: String
    createdAt: String!
    updatedAt: String!
    createdBy: User!
  }

  type Location {
    address: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
    coordinates: Coordinates
  }

  type Coordinates {
    latitude: Float!
    longitude: Float!
  }

  type Dimensions {
    length: Float!
    width: Float!
    height: Float!
    unit: String!
  }

  type ShipmentConnection {
    edges: [ShipmentEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ShipmentEdge {
    node: Shipment!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input LocationInput {
    address: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
    coordinates: CoordinatesInput
  }

  input CoordinatesInput {
    latitude: Float!
    longitude: Float!
  }

  input DimensionsInput {
    length: Float!
    width: Float!
    height: Float!
    unit: String!
  }

  input CreateShipmentInput {
    shipperName: String!
    carrierName: String!
    pickupLocation: LocationInput!
    deliveryLocation: LocationInput!
    trackingNumber: String!
    status: ShipmentStatus!
    rate: Float!
    weight: Float!
    dimensions: DimensionsInput!
    estimatedDelivery: String!
    notes: String
  }

  input UpdateShipmentInput {
    shipperName: String
    carrierName: String
    pickupLocation: LocationInput
    deliveryLocation: LocationInput
    status: ShipmentStatus
    rate: Float
    weight: Float
    dimensions: DimensionsInput
    estimatedDelivery: String
    actualDelivery: String
    notes: String
  }

  input ShipmentFilter {
    status: ShipmentStatus
    carrierName: String
    shipperName: String
    searchTerm: String
  }

  enum SortOrder {
    ASC
    DESC
  }

  input ShipmentSort {
    field: String!
    order: SortOrder!
  }

  type Query {
    # Authentication
    me: User

    # Shipment queries
    shipments(
      filter: ShipmentFilter
      sort: ShipmentSort
      first: Int
      after: String
      last: Int
      before: String
    ): ShipmentConnection!

    shipment(id: ID!): Shipment

    # Statistics (Admin only)
    shipmentStats: ShipmentStats
  }

  type ShipmentStats {
    totalShipments: Int!
    pendingShipments: Int!
    inTransitShipments: Int!
    deliveredShipments: Int!
    totalRevenue: Float!
    averageRate: Float!
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!, name: String!, role: Role): AuthPayload!

    # Shipment mutations
    createShipment(input: CreateShipmentInput!): Shipment!
    updateShipment(id: ID!, input: UpdateShipmentInput!): Shipment!
    deleteShipment(id: ID!): Boolean!

    # Bulk operations (Admin only)
    bulkUpdateStatus(ids: [ID!]!, status: ShipmentStatus!): [Shipment!]!
  }
`;

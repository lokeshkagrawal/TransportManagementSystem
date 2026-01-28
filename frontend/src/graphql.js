import { gql } from '@apollo/client';

// Authentication Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $name: String!, $role: Role) {
    register(email: $email, password: $password, name: $name, role: $role) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

// Shipment Queries
export const GET_SHIPMENTS = gql`
  query GetShipments(
    $first: Int
    $after: String
    $filter: ShipmentFilter
    $sort: ShipmentSort
  ) {
    shipments(first: $first, after: $after, filter: $filter, sort: $sort) {
      edges {
        node {
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
          status
          rate
          weight
          estimatedDelivery
          actualDelivery
          createdAt
          createdBy {
            name
            email
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_SHIPMENT = gql`
  query GetShipment($id: ID!) {
    shipment(id: $id) {
      id
      trackingNumber
      shipperName
      carrierName
      pickupLocation {
        address
        city
        state
        zipCode
        country
        coordinates {
          latitude
          longitude
        }
      }
      deliveryLocation {
        address
        city
        state
        zipCode
        country
        coordinates {
          latitude
          longitude
        }
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
      estimatedDelivery
      actualDelivery
      notes
      createdAt
      updatedAt
      createdBy {
        id
        name
        email
        role
      }
    }
  }
`;

export const GET_SHIPMENT_STATS = gql`
  query GetShipmentStats {
    shipmentStats {
      totalShipments
      pendingShipments
      inTransitShipments
      deliveredShipments
      totalRevenue
      averageRate
    }
  }
`;

// Shipment Mutations
export const CREATE_SHIPMENT = gql`
  mutation CreateShipment($input: CreateShipmentInput!) {
    createShipment(input: $input) {
      id
      trackingNumber
      shipperName
      carrierName
      status
    }
  }
`;

export const UPDATE_SHIPMENT = gql`
  mutation UpdateShipment($id: ID!, $input: UpdateShipmentInput!) {
    updateShipment(id: $id, input: $input) {
      id
      trackingNumber
      status
      actualDelivery
      updatedAt
    }
  }
`;

export const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id)
  }
`;

export const BULK_UPDATE_STATUS = gql`
  mutation BulkUpdateStatus($ids: [ID!]!, $status: ShipmentStatus!) {
    bulkUpdateStatus(ids: $ids, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

// User Query
export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
    }
  }
`;

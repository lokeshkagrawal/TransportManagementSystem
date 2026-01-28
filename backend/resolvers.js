import {
  users,
  shipments,
  findUserById,
  findUserByEmail,
  findShipmentById,
  getAllShipments,
  createShipment,
  updateShipment,
  deleteShipment
} from './database.js';
import {
  generateToken,
  comparePassword,
  hashPassword,
  requireAuth,
  requireAdmin,
  canModifyShipment
} from './auth.js';
import DataLoader from 'dataloader';

// DataLoader for performance optimization
const createUserLoader = () => {
  return new DataLoader(async (userIds) => {
    return userIds.map(id => findUserById(id));
  });
};

// Pagination helpers
const encodeCursor = (id) => Buffer.from(id).toString('base64');
const decodeCursor = (cursor) => Buffer.from(cursor, 'base64').toString('ascii');

const paginateResults = (items, first, after, last, before) => {
  let startIndex = 0;
  let endIndex = items.length;

  // Handle 'after' cursor (forward pagination)
  if (after) {
    const afterIndex = items.findIndex(item => item.id === decodeCursor(after));
    if (afterIndex >= 0) {
      startIndex = afterIndex + 1;
    }
  }

  // Handle 'before' cursor (backward pagination)
  if (before) {
    const beforeIndex = items.findIndex(item => item.id === decodeCursor(before));
    if (beforeIndex >= 0) {
      endIndex = beforeIndex;
    }
  }

  // Handle 'first' limit (forward pagination)
  if (first) {
    endIndex = Math.min(startIndex + first, endIndex);
  }

  // Handle 'last' limit (backward pagination)
  if (last) {
    startIndex = Math.max(endIndex - last, startIndex);
  }

  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    edges: paginatedItems.map(item => ({
      node: item,
      cursor: encodeCursor(item.id)
    })),
    pageInfo: {
      hasNextPage: endIndex < items.length,
      hasPreviousPage: startIndex > 0,
      startCursor: paginatedItems.length > 0 ? encodeCursor(paginatedItems[0].id) : null,
      endCursor: paginatedItems.length > 0 ? encodeCursor(paginatedItems[paginatedItems.length - 1].id) : null
    },
    totalCount: items.length
  };
};

// Filter and sort helpers
const filterShipments = (allShipments, filter) => {
  if (!filter) return allShipments;

  return allShipments.filter(shipment => {
    if (filter.status && shipment.status !== filter.status) {
      return false;
    }
    if (filter.carrierName && !shipment.carrierName.toLowerCase().includes(filter.carrierName.toLowerCase())) {
      return false;
    }
    if (filter.shipperName && !shipment.shipperName.toLowerCase().includes(filter.shipperName.toLowerCase())) {
      return false;
    }
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      return (
        shipment.trackingNumber.toLowerCase().includes(term) ||
        shipment.shipperName.toLowerCase().includes(term) ||
        shipment.carrierName.toLowerCase().includes(term) ||
        shipment.pickupLocation.city.toLowerCase().includes(term) ||
        shipment.deliveryLocation.city.toLowerCase().includes(term)
      );
    }
    return true;
  });
};

const sortShipments = (allShipments, sort) => {
  if (!sort) {
    // Default sort by createdAt descending
    return [...allShipments].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  return [...allShipments].sort((a, b) => {
    let aValue = a[sort.field];
    let bValue = b[sort.field];

    // Handle nested fields
    if (sort.field.includes('.')) {
      const fields = sort.field.split('.');
      aValue = fields.reduce((obj, field) => obj?.[field], a);
      bValue = fields.reduce((obj, field) => obj?.[field], b);
    }

    // Handle different data types
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    } else if (aValue instanceof Date) {
      aValue = aValue.getTime();
      bValue = bValue.getTime();
    }

    if (sort.order === 'ASC') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
};

export const resolvers = {
  Query: {
    me: (_, __, context) => {
      requireAuth(context);
      return findUserById(context.user.id);
    },

    shipments: (_, { filter, sort, first, after, last, before }, context) => {
      requireAuth(context);
      
      let allShipments = getAllShipments();

      // Employees can only see their own shipments
      if (context.user.role === 'EMPLOYEE') {
        allShipments = allShipments.filter(s => s.createdBy === context.user.id);
      }

      // Apply filters
      allShipments = filterShipments(allShipments, filter);

      // Apply sorting
      allShipments = sortShipments(allShipments, sort);

      // Apply pagination
      return paginateResults(allShipments, first, after, last, before);
    },

    shipment: (_, { id }, context) => {
      requireAuth(context);
      const shipment = findShipmentById(id);
      
      if (!shipment) {
        throw new Error('Shipment not found');
      }

      // Check access permissions
      if (context.user.role === 'EMPLOYEE' && shipment.createdBy !== context.user.id) {
        throw new Error('You do not have permission to view this shipment');
      }

      return shipment;
    },

    shipmentStats: (_, __, context) => {
      requireAdmin(context);
      
      const allShipments = getAllShipments();
      
      return {
        totalShipments: allShipments.length,
        pendingShipments: allShipments.filter(s => s.status === 'PENDING').length,
        inTransitShipments: allShipments.filter(s => s.status === 'IN_TRANSIT').length,
        deliveredShipments: allShipments.filter(s => s.status === 'DELIVERED').length,
        totalRevenue: allShipments.reduce((sum, s) => sum + s.rate, 0),
        averageRate: allShipments.length > 0 
          ? allShipments.reduce((sum, s) => sum + s.rate, 0) / allShipments.length 
          : 0
      };
    }
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = findUserByEmail(email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValid = await comparePassword(password, user.password);
      
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    },

    register: async (_, { email, password, name, role }) => {
      // Check if user already exists
      if (findUserByEmail(email)) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await hashPassword(password);
      
      const newUser = {
        id: String(users.length + 1),
        email,
        password: hashedPassword,
        name,
        role: role || 'EMPLOYEE'
      };

      users.push(newUser);

      const token = generateToken(newUser);

      return {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      };
    },

    createShipment: (_, { input }, context) => {
      const user = requireAuth(context);
      
      const newShipment = createShipment(input, user.id);
      
      return newShipment;
    },

    updateShipment: (_, { id, input }, context) => {
      requireAuth(context);
      
      const existingShipment = findShipmentById(id);
      
      if (!existingShipment) {
        throw new Error('Shipment not found');
      }

      canModifyShipment(context, existingShipment);

      const updatedShipment = updateShipment(id, input);
      
      return updatedShipment;
    },

    deleteShipment: (_, { id }, context) => {
      requireAuth(context);
      
      const shipment = findShipmentById(id);
      
      if (!shipment) {
        throw new Error('Shipment not found');
      }

      canModifyShipment(context, shipment);

      return deleteShipment(id);
    },

    bulkUpdateStatus: (_, { ids, status }, context) => {
      requireAdmin(context);
      
      const updatedShipments = [];
      
      for (const id of ids) {
        const shipment = findShipmentById(id);
        if (shipment) {
          const updated = updateShipment(id, { status });
          updatedShipments.push(updated);
        }
      }

      return updatedShipments;
    }
  },

  Shipment: {
    createdBy: (parent, _, context) => {
      // Use DataLoader for efficient batching
      if (!context.userLoader) {
        context.userLoader = createUserLoader();
      }
      return context.userLoader.load(parent.createdBy);
    }
  }
};

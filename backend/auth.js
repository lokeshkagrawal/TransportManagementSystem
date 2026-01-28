import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'your-secret-key-change-in-production-2026';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const getUserFromToken = (token) => {
  if (!token) return null;
  
  // Remove 'Bearer ' prefix if present
  const cleanToken = token.replace('Bearer ', '');
  return verifyToken(cleanToken);
};

// Authorization helpers
export const requireAuth = (context) => {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
};

export const requireAdmin = (context) => {
  const user = requireAuth(context);
  if (user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return user;
};

export const canAccessShipment = (context, shipment) => {
  const user = requireAuth(context);
  
  // Admins can access everything
  if (user.role === 'ADMIN') {
    return true;
  }
  
  // Employees can only access their own shipments
  return shipment.createdBy === user.id;
};

export const canModifyShipment = (context, shipment) => {
  const user = requireAuth(context);
  
  // Admins can modify everything
  if (user.role === 'ADMIN') {
    return true;
  }
  
  // Employees can only modify their own shipments
  if (shipment.createdBy === user.id) {
    return true;
  }
  
  throw new Error('You do not have permission to modify this shipment');
};

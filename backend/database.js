import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file path
const dataPath = path.join(__dirname, 'data.json');

// Initialize data with mock data
const initialData = {
  users: [
    {
      id: '1',
      email: 'admin@tms.com',
      password: bcrypt.hashSync('admin@123', 10),
      name: 'Admin User',
      role: 'ADMIN'
    },
    {
      id: '2',
      email: 'employee@tms.com',
      password: bcrypt.hashSync('employee@123', 10),
      name: 'John Employee',
      role: 'EMPLOYEE'
    }
  ],
 shipments : [
  {
    id: '1',
    shipperName: 'Amazon lokesh Logistics',
    carrierName: 'FedEx Express',
    pickupLocation: {
      address: '410 Terry Ave N',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98109',
      country: 'USA',
      coordinates: { latitude: 47.6205, longitude: -122.3493 }
    },
    deliveryLocation: {
      address: '1600 Amphitheatre Parkway',
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94043',
      country: 'USA',
      coordinates: { latitude: 37.4220, longitude: -122.0841 }
    },
    trackingNumber: 'TRK001234567',
    status: 'IN_TRANSIT',
    rate: 450.00,
    weight: 125.5,
    dimensions: { length: 48, width: 40, height: 36, unit: 'inches' },
    estimatedDelivery: '2026-01-30T10:00:00Z',
    actualDelivery: null,
    notes: 'Fragile items - Handle with care',
    createdAt: '2026-01-25T08:30:00Z',
    updatedAt: '2026-01-27T09:15:00Z',
    createdBy: '1'
  },
  {
    id: '2',
    shipperName: 'Walmart Supply Chain',
    carrierName: 'UPS Ground',
    pickupLocation: {
      address: '702 SW 8th St',
      city: 'Bentonville',
      state: 'AR',
      zipCode: '72716',
      country: 'USA',
      coordinates: { latitude: 36.3729, longitude: -94.2088 }
    },
    deliveryLocation: {
      address: '350 Fifth Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10118',
      country: 'USA',
      coordinates: { latitude: 40.7484, longitude: -73.9857 }
    },
    trackingNumber: 'TRK001234568',
    status: 'DELIVERED',
    rate: 890.50,
    weight: 450.0,
    dimensions: { length: 60, width: 48, height: 48, unit: 'inches' },
    estimatedDelivery: '2026-01-26T14:00:00Z',
    actualDelivery: '2026-01-26T13:45:00Z',
    notes: 'Signature required upon delivery',
    createdAt: '2026-01-23T10:00:00Z',
    updatedAt: '2026-01-26T13:45:00Z',
    createdBy: '2'
  },
  {
    id: '3',
    shipperName: 'Tesla Manufacturing',
    carrierName: 'DHL Express',
    pickupLocation: {
      address: '1 Tesla Road',
      city: 'Austin',
      state: 'TX',
      zipCode: '78725',
      country: 'USA',
      coordinates: { latitude: 30.2672, longitude: -97.7431 }
    },
    deliveryLocation: {
      address: '1 Hacker Way',
      city: 'Menlo Park',
      state: 'CA',
      zipCode: '94025',
      country: 'USA',
      coordinates: { latitude: 37.4849, longitude: -122.1477 }
    },
    trackingNumber: 'TRK001234569',
    status: 'PENDING',
    rate: 1250.00,
    weight: 875.0,
    dimensions: { length: 72, width: 60, height: 54, unit: 'inches' },
    estimatedDelivery: '2026-02-02T16:00:00Z',
    actualDelivery: null,
    notes: 'High-value electronics - Temperature controlled shipping required',
    createdAt: '2026-01-27T07:00:00Z',
    updatedAt: '2026-01-27T07:00:00Z',
    createdBy: '1'
  },
  {
    id: '4',
    shipperName: 'Apple Supply Chain',
    carrierName: 'FedEx Priority',
    pickupLocation: {
      address: 'One Apple Park Way',
      city: 'Cupertino',
      state: 'CA',
      zipCode: '95014',
      country: 'USA',
      coordinates: { latitude: 37.3349, longitude: -122.0090 }
    },
    deliveryLocation: {
      address: '233 S Wacker Dr',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60606',
      country: 'USA',
      coordinates: { latitude: 41.8789, longitude: -87.6359 }
    },
    trackingNumber: 'TRK001234570',
    status: 'IN_TRANSIT',
    rate: 675.25,
    weight: 250.0,
    dimensions: { length: 54, width: 42, height: 40, unit: 'inches' },
    estimatedDelivery: '2026-01-29T12:00:00Z',
    actualDelivery: null,
    notes: 'Rush delivery - Premium service',
    createdAt: '2026-01-26T06:30:00Z',
    updatedAt: '2026-01-27T08:20:00Z',
    createdBy: '1'
  },
  {
    id: '5',
    shipperName: 'Microsoft Logistics',
    carrierName: 'UPS Next Day Air',
    pickupLocation: {
      address: '1 Microsoft Way',
      city: 'Redmond',
      state: 'WA',
      zipCode: '98052',
      country: 'USA',
      coordinates: { latitude: 47.6740, longitude: -122.1215 }
    },
    deliveryLocation: {
      address: '1 Infinite Loop',
      city: 'Cupertino',
      state: 'CA',
      zipCode: '95014',
      country: 'USA',
      coordinates: { latitude: 37.3318, longitude: -122.0312 }
    },
    trackingNumber: 'TRK001234571',
    status: 'DELIVERED',
    rate: 980.00,
    weight: 320.5,
    dimensions: { length: 48, width: 36, height: 32, unit: 'inches' },
    estimatedDelivery: '2026-01-25T09:00:00Z',
    actualDelivery: '2026-01-25T08:45:00Z',
    notes: 'Confidential materials - ID verification required',
    createdAt: '2026-01-24T14:00:00Z',
    updatedAt: '2026-01-25T08:45:00Z',
    createdBy: '2'
  },
  {
    id: '6',
    shipperName: 'Google Cloud',
    carrierName: 'DHL International',
    pickupLocation: {
      address: '1600 Amphitheatre Parkway',
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94043',
      country: 'USA',
      coordinates: { latitude: 37.4220, longitude: -122.0841 }
    },
    deliveryLocation: {
      address: 'Brandschenkestrasse 110',
      city: 'Zurich',
      state: 'ZH',
      zipCode: '8002',
      country: 'Switzerland',
      coordinates: { latitude: 47.3769, longitude: 8.5417 }
    },
    trackingNumber: 'TRK001234572',
    status: 'IN_TRANSIT',
    rate: 2340.00,
    weight: 650.0,
    dimensions: { length: 60, width: 48, height: 48, unit: 'inches' },
    estimatedDelivery: '2026-02-05T10:00:00Z',
    actualDelivery: null,
    notes: 'International shipment - Customs documentation included',
    createdAt: '2026-01-26T11:00:00Z',
    updatedAt: '2026-01-27T07:30:00Z',
    createdBy: '1'
  },
  {
    id: '7',
    shipperName: 'SpaceX Logistics',
    carrierName: 'XPO Logistics',
    pickupLocation: {
      address: 'Rocket Road',
      city: 'Hawthorne',
      state: 'CA',
      zipCode: '90250',
      country: 'USA',
      coordinates: { latitude: 33.9207, longitude: -118.3280 }
    },
    deliveryLocation: {
      address: 'Kennedy Space Center',
      city: 'Merritt Island',
      state: 'FL',
      zipCode: '32899',
      country: 'USA',
      coordinates: { latitude: 28.5729, longitude: -80.6490 }
    },
    trackingNumber: 'TRK001234573',
    status: 'PENDING',
    rate: 15000.00,
    weight: 5000.0,
    dimensions: { length: 120, width: 96, height: 84, unit: 'inches' },
    estimatedDelivery: '2026-02-10T06:00:00Z',
    actualDelivery: null,
    notes: 'Oversized cargo - Special handling required. Military escort needed.',
    createdAt: '2026-01-27T09:00:00Z',
    updatedAt: '2026-01-27T09:00:00Z',
    createdBy: '1'
  },
  {
    id: '8',
    shipperName: 'Nike Distribution',
    carrierName: 'FedEx Ground',
    pickupLocation: {
      address: 'One Bowerman Drive',
      city: 'Beaverton',
      state: 'OR',
      zipCode: '97005',
      country: 'USA',
      coordinates: { latitude: 45.5051, longitude: -122.8379 }
    },
    deliveryLocation: {
      address: '620 Avenue of the Americas',
      city: 'New York',
      state: 'NY',
      zipCode: '10011',
      country: 'USA',
      coordinates: { latitude: 40.7410, longitude: -73.9960 }
    },
    trackingNumber: 'TRK001234574',
    status: 'IN_TRANSIT',
    rate: 540.00,
    weight: 180.0,
    dimensions: { length: 42, width: 36, height: 30, unit: 'inches' },
    estimatedDelivery: '2026-01-31T15:00:00Z',
    actualDelivery: null,
    notes: 'Retail merchandise - Standard handling',
    createdAt: '2026-01-26T13:00:00Z',
    updatedAt: '2026-01-27T06:45:00Z',
    createdBy: '2'
  },
  {
    id: '9',
    shipperName: 'Coca-Cola Company',
    carrierName: 'J.B. Hunt',
    pickupLocation: {
      address: 'One Coca Cola Plaza',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30313',
      country: 'USA',
      coordinates: { latitude: 33.7490, longitude: -84.3880 }
    },
    deliveryLocation: {
      address: '100 Universal City Plaza',
      city: 'Universal City',
      state: 'CA',
      zipCode: '91608',
      country: 'USA',
      coordinates: { latitude: 34.1381, longitude: -118.3534 }
    },
    trackingNumber: 'TRK001234575',
    status: 'CANCELLED',
    rate: 1100.00,
    weight: 2000.0,
    dimensions: { length: 96, width: 84, height: 72, unit: 'inches' },
    estimatedDelivery: '2026-02-01T10:00:00Z',
    actualDelivery: null,
    notes: 'Order cancelled by customer',
    createdAt: '2026-01-25T15:00:00Z',
    updatedAt: '2026-01-26T16:30:00Z',
    createdBy: '2'
  },
  {
    id: '10',
    shipperName: 'Intel Corporation',
    carrierName: 'UPS Worldwide Express',
    pickupLocation: {
      address: '2200 Mission College Blvd',
      city: 'Santa Clara',
      state: 'CA',
      zipCode: '95054',
      country: 'USA',
      coordinates: { latitude: 37.3874, longitude: -121.9632 }
    },
    deliveryLocation: {
      address: '1-1 Toyosu',
      city: 'Tokyo',
      state: 'Tokyo',
      zipCode: '135-0061',
      country: 'Japan',
      coordinates: { latitude: 35.6532, longitude: 139.7966 }
    },
    trackingNumber: 'TRK001234576',
    status: 'IN_TRANSIT',
    rate: 3200.00,
    weight: 425.0,
    dimensions: { length: 48, width: 40, height: 36, unit: 'inches' },
    estimatedDelivery: '2026-02-03T18:00:00Z',
    actualDelivery: null,
    notes: 'High-tech equipment - Handle with extreme care. Temperature sensitive.',
    createdAt: '2026-01-27T05:00:00Z',
    updatedAt: '2026-01-27T09:30:00Z',
    createdBy: '1'
  },
  {
    id: '11',
    shipperName: 'Pfizer Pharmaceuticals',
    carrierName: 'DHL Medical Express',
    pickupLocation: {
      address: '235 East 42nd Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10017',
      country: 'USA',
      coordinates: { latitude: 40.7505, longitude: -73.9756 }
    },
    deliveryLocation: {
      address: '450 Serra Mall',
      city: 'Stanford',
      state: 'CA',
      zipCode: '94305',
      country: 'USA',
      coordinates: { latitude: 37.4275, longitude: -122.1697 }
    },
    trackingNumber: 'TRK001234577',
    status: 'DELIVERED',
    rate: 2450.00,
    weight: 85.5,
    dimensions: { length: 30, width: 24, height: 20, unit: 'inches' },
    estimatedDelivery: '2026-01-26T08:00:00Z',
    actualDelivery: '2026-01-26T07:30:00Z',
    notes: 'Temperature-controlled shipment. Medical supplies - Priority delivery.',
    createdAt: '2026-01-25T12:00:00Z',
    updatedAt: '2026-01-26T07:30:00Z',
    createdBy: '1'
  },
  {
    id: '12',
    shipperName: 'Boeing Aerospace',
    carrierName: 'Panalpina Heavy Haul',
    pickupLocation: {
      address: '100 N Riverside Plaza',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60606',
      country: 'USA',
      coordinates: { latitude: 41.8839, longitude: -87.6389 }
    },
    deliveryLocation: {
      address: '3003 W Perimeter Rd',
      city: 'Everett',
      state: 'WA',
      zipCode: '98204',
      country: 'USA',
      coordinates: { latitude: 47.9062, longitude: -122.2808 }
    },
    trackingNumber: 'TRK001234578',
    status: 'PENDING',
    rate: 25000.00,
    weight: 15000.0,
    dimensions: { length: 240, width: 180, height: 120, unit: 'inches' },
    estimatedDelivery: '2026-02-15T10:00:00Z',
    actualDelivery: null,
    notes: 'Aircraft components - Oversized cargo. Requires specialized equipment and permits.',
    createdAt: '2026-01-27T10:30:00Z',
    updatedAt: '2026-01-27T10:30:00Z',
    createdBy: '1'
  }
],
  shipmentIdCounter: 13
};

// Load or initialize data
let data = { users: [], shipments: [], shipmentIdCounter: 1 };

const loadData = () => {
  try {
    if (fs.existsSync(dataPath)) {
      const fileData = fs.readFileSync(dataPath, 'utf8');
      data = JSON.parse(fileData);
      console.log(`📦 Loaded ${data.shipments.length} shipments and ${data.users.length} users from file`);
    } else {
      console.log('⚠️  data.json not found, creating with initial data...');
      data = initialData;
      saveData();
      console.log('✅ data.json created with sample data');
    }
  } catch (error) {
    console.error('❌ Error loading data:', error.message);
    console.log('Creating new data file with initial data...');
    data = initialData;
    saveData();
  }
};

// Save data to file
const saveData = () => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('✅ Data saved to file');
  } catch (error) {
    console.error('❌ Error saving data:', error.message);
  }
};

// Initialize data on module load
loadData();

// Export data arrays
export let users = data.users;
export let shipments = data.shipments;

// Helper functions
let shipmentIdCounter = data.shipmentIdCounter || 13;

export const generateShipmentId = () => {
  const id = String(shipmentIdCounter++);
  data.shipmentIdCounter = shipmentIdCounter;
  return id;
};

export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findShipmentById = (id) => {
  return shipments.find(shipment => shipment.id === id);
};

export const getAllShipments = () => {
  return [...shipments];
};

export const createShipment = (shipmentData, userId) => {
  const newShipment = {
    id: generateShipmentId(),
    ...shipmentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: userId
  };
  
  shipments.push(newShipment);
  data.shipments = shipments; // Sync with data object
  saveData(); // ✅ Save to file
  
  return newShipment;
};

export const updateShipment = (id, updates) => {
  const index = shipments.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  shipments[index] = {
    ...shipments[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  data.shipments = shipments; // Sync with data object
  saveData(); // ✅ Save to file
  
  return shipments[index];
};

export const deleteShipment = (id) => {
  const index = shipments.findIndex(s => s.id === id);
  if (index === -1) return false;
  
  shipments.splice(index, 1);
  data.shipments = shipments; // Sync with data object
  saveData(); // ✅ Save to file
  
  return true;
};
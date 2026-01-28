import React, { memo } from 'react';
import { Package } from 'lucide-react';

/**
 * GridView Component - Optimized with React.memo
 * 
 * Performance optimization: Only re-renders when data changes
 */
function GridView({ shipments, onShipmentClick }) {
  const getStatusClass = (status) => {
    const statusMap = {
      'PENDING': 'pending',
      'IN_TRANSIT': 'in-transit',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled'
    };
    return statusMap[status] || '';
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!shipments || shipments.length === 0) {
    return (
      <div className="empty-state">
        <Package />
        <h3>No Shipments Found</h3>
        <p>Try adjusting your filters or create a new shipment</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="grid-view">
        <table>
          <thead>
            <tr>
              <th>Tracking #</th>
              <th>Shipper</th>
              <th>Carrier</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Rate</th>
              <th>Weight (lbs)</th>
              <th>Est. Delivery</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr
                key={shipment.id}
                onClick={() => onShipmentClick(shipment)}
              >
                <td>
                  <strong>{shipment.trackingNumber}</strong>
                </td>
                <td>{shipment.shipperName}</td>
                <td>{shipment.carrierName}</td>
                <td>
                  {shipment.pickupLocation.city}, {shipment.pickupLocation.state}
                </td>
                <td>
                  {shipment.deliveryLocation.city}, {shipment.deliveryLocation.state}
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(shipment.status)}`}>
                    {formatStatus(shipment.status)}
                  </span>
                </td>
                <td>{formatCurrency(shipment.rate)}</td>
                <td>{shipment.weight}</td>
                <td>{formatDate(shipment.estimatedDelivery)}</td>
                <td>{formatDate(shipment.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Export memoized component for better performance
export default memo(GridView);

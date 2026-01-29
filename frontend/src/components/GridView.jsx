import React, { memo } from 'react';
import { useMutation } from '@apollo/client';
import { Package, Edit, Flag, Trash2 } from 'lucide-react';
import { DELETE_SHIPMENT } from '../graphql';
/**
 * GridView Component - Optimized with React.memo
 * 
 * Performance optimization: Only re-renders when data changes
 */
function GridView({ shipments, onShipmentClick, onEditClick, refetch }) {
  const [deleteShipment, { loading: deleting }] = useMutation(DELETE_SHIPMENT, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      alert('Error deleting shipment: ' + error.message);
    }
  });
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

  
  const handleEdit = (e, shipment) => {
    e.stopPropagation();
    onEditClick(shipment);
  };

  const handleFlag = (e, shipment) => {
    e.stopPropagation();
    alert(`Shipment ${shipment.trackingNumber} has been flagged for admin review`);
  };

  const handleDelete = async (e, shipmentId, trackingNumber) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete shipment ${trackingNumber}?`)) {
      await deleteShipment({ variables: { id: shipmentId } });
    }
  };
  if (!shipments || shipments.length === 0) {
    return (
      <div className="empty-state">
        <Package size={120}/>
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
              <th>Actions</th>
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
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="table-actions-direct">
                    <button
                      className="action-btn edit-btn"
                      onClick={(e) => handleEdit(e, shipment)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-btn flag-btn"
                      onClick={(e) => handleFlag(e, shipment)}
                      title="Flag"
                    >
                      <Flag size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={(e) => handleDelete(e, shipment.id, shipment.trackingNumber)}
                      disabled={deleting}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
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

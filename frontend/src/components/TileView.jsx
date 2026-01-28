import React, { useState, memo } from 'react';
import { useMutation } from '@apollo/client';
import { MoreVertical, Edit, Flag, Trash2, Package, MapPin } from 'lucide-react';
import { DELETE_SHIPMENT } from '../graphql';

/**
 * TileView Component - Optimized with React.memo
 * 
 * Performance optimization: Only re-renders when shipments data actually changes
 * Prevents unnecessary re-renders when parent component updates
 */
function TileView({ shipments, onShipmentClick, onEditClick, refetch }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const [deleteShipment, { loading: deleting }] = useMutation(DELETE_SHIPMENT, {
    onCompleted: () => {
      refetch();
      setOpenMenuId(null);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleBunClick = (e, shipmentId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === shipmentId ? null : shipmentId);
  };

  const handleEdit = (e, shipment) => {
    e.stopPropagation();
    setOpenMenuId(null);
    onEditClick(shipment);
  };

  const handleFlag = (e, shipment) => {
    e.stopPropagation();
    alert(`Flag functionality for ${shipment.trackingNumber} would send notification to admin`);
    setOpenMenuId(null);
  };

  const handleDelete = async (e, shipmentId, trackingNumber) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete shipment ${trackingNumber}?`)) {
      await deleteShipment({ variables: { id: shipmentId } });
    } else {
      setOpenMenuId(null);
    }
  };

  if (!shipments || shipments.length === 0) {
    return (
      <div className="empty-state">
        <Package size={120} />
        <h3>No Shipments Found</h3>
        <p>Try adjusting your filters or create a new shipment</p>
      </div>
    );
  }

  return (
    <div className="tile-view">
      {shipments.map((shipment) => (
        <div
          key={shipment.id}
          className="tile-card"
          onClick={() => onShipmentClick(shipment)}
        >
          <div className="tile-header">
            <div>
              <div className="tile-title">{shipment.trackingNumber}</div>
              <div className="tile-subtitle">{shipment.carrierName}</div>
            </div>
            <div className="tile-actions">
              <button
                className="bun-button"
                onClick={(e) => handleBunClick(e, shipment.id)}
                disabled={deleting}
              >
                <MoreVertical size={20} />
              </button>
              {openMenuId === shipment.id && (
                <div className="bun-menu">
                  <button onClick={(e) => handleEdit(e, shipment)}>
                    <Edit size={16} />
                    Edit
                  </button>
                  <button onClick={(e) => handleFlag(e, shipment)}>
                    <Flag size={16} />
                    Flag
                  </button>
                  <button
                    className="danger"
                    onClick={(e) => handleDelete(e, shipment.id, shipment.trackingNumber)}
                    disabled={deleting}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="tile-content">
            <div className="tile-field">
              <span className="tile-field-label">Status</span>
              <span className={`status-badge ${getStatusClass(shipment.status)}`}>
                {formatStatus(shipment.status)}
              </span>
            </div>

            <div className="tile-field">
              <span className="tile-field-label">Shipper</span>
              <span className="tile-field-value">{shipment.shipperName}</span>
            </div>

            <div className="tile-field">
              <span className="tile-field-label">From</span>
              <span className="tile-field-value">
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {shipment.pickupLocation.city}, {shipment.pickupLocation.state}
              </span>
            </div>

            <div className="tile-field">
              <span className="tile-field-label">To</span>
              <span className="tile-field-value">
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {shipment.deliveryLocation.city}, {shipment.deliveryLocation.state}
              </span>
            </div>

            <div className="tile-field">
              <span className="tile-field-label">Rate</span>
              <span className="tile-field-value">{formatCurrency(shipment.rate)}</span>
            </div>

            <div className="tile-field">
              <span className="tile-field-label">Weight</span>
              <span className="tile-field-value">{shipment.weight} lbs</span>
            </div>

            <div className="tile-field">
              <span className="tile-field-label">Est. Delivery</span>
              <span className="tile-field-value">{formatDate(shipment.estimatedDelivery)}</span>
            </div>

            <div className="tile-field">
              <span className="tile-field-label">Created By</span>
              <span className="tile-field-value">{shipment.createdBy.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
// Only re-renders when shipments array actually changes
export default memo(TileView, (prevProps, nextProps) => {
  // Custom comparison: only re-render if shipments data changed
  return prevProps.shipments.length === nextProps.shipments.length &&
         prevProps.shipments.every((ship, idx) => ship.id === nextProps.shipments[idx]?.id);
});

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_SHIPMENT } from '../graphql';
import {
  X,
  Package,
  MapPin,
  DollarSign,
  Weight,
  Calendar,
  User,
  FileText,
  Truck,
  Building
} from 'lucide-react';

function ShipmentDetail({ shipment, onClose }) {
  const { data, loading } = useQuery(GET_SHIPMENT, {
    variables: { id: shipment.id }
  });

  const detailedShipment = data?.shipment || shipment;

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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Shipment Details</h3>
            <span className={`status-badge ${getStatusClass(detailedShipment.status)}`}>
              {formatStatus(detailedShipment.status)}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {/* Tracking Information */}
              <div className="detail-section">
                <h4>
                  <Package size={20} />
                  Tracking Information
                </h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Tracking Number</div>
                    <div className="detail-value">{detailedShipment.trackingNumber}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Shipper Name</div>
                    <div className="detail-value">{detailedShipment.shipperName}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Carrier Name</div>
                    <div className="detail-value">{detailedShipment.carrierName}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Created By</div>
                    <div className="detail-value">
                      {detailedShipment.createdBy.name}
                      <br />
                      <small style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                        {detailedShipment.createdBy.email}
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="detail-section">
                <h4>
                  <MapPin size={20} />
                  Location Details
                </h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Pickup Location</div>
                    <div className="detail-value">
                      {detailedShipment.pickupLocation.address}
                      <br />
                      {detailedShipment.pickupLocation.city}, {detailedShipment.pickupLocation.state} {detailedShipment.pickupLocation.zipCode}
                      <br />
                      {detailedShipment.pickupLocation.country}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Delivery Location</div>
                    <div className="detail-value">
                      {detailedShipment.deliveryLocation.address}
                      <br />
                      {detailedShipment.deliveryLocation.city}, {detailedShipment.deliveryLocation.state} {detailedShipment.deliveryLocation.zipCode}
                      <br />
                      {detailedShipment.deliveryLocation.country}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="detail-section">
                <h4>
                  <Truck size={20} />
                  Shipment Details
                </h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Rate</div>
                    <div className="detail-value">{formatCurrency(detailedShipment.rate)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Weight</div>
                    <div className="detail-value">{detailedShipment.weight} lbs</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Dimensions</div>
                    <div className="detail-value">
                      {detailedShipment.dimensions.length} × {detailedShipment.dimensions.width} × {detailedShipment.dimensions.height} {detailedShipment.dimensions.unit}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Volume</div>
                    <div className="detail-value">
                      {(detailedShipment.dimensions.length * detailedShipment.dimensions.width * detailedShipment.dimensions.height).toFixed(2)} cu {detailedShipment.dimensions.unit}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="detail-section">
                <h4>
                  <Calendar size={20} />
                  Timeline
                </h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Created At</div>
                    <div className="detail-value">{formatDate(detailedShipment.createdAt)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Last Updated</div>
                    <div className="detail-value">{formatDate(detailedShipment.updatedAt)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Estimated Delivery</div>
                    <div className="detail-value">{formatDate(detailedShipment.estimatedDelivery)}</div>
                  </div>
                  {detailedShipment.actualDelivery && (
                    <div className="detail-item">
                      <div className="detail-label">Actual Delivery</div>
                      <div className="detail-value">{formatDate(detailedShipment.actualDelivery)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {detailedShipment.notes && (
                <div className="detail-section">
                  <h4>
                    <FileText size={20} />
                    Additional Notes
                  </h4>
                  <div className="detail-item">
                    <div className="detail-value">{detailedShipment.notes}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShipmentDetail;

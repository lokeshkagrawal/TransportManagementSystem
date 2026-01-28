import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SHIPMENT, UPDATE_SHIPMENT } from '../graphql';
import { X } from 'lucide-react';

function ShipmentForm({ shipment, onClose, refetch }) {
  const isEdit = !!shipment;
  
  const [formData, setFormData] = useState({
    shipperName: '',
    carrierName: '',
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZipCode: '',
    pickupCountry: 'USA',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZipCode: '',
    deliveryCountry: 'USA',
    trackingNumber: '',
    status: 'PENDING',
    rate: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    unit: 'inches',
    estimatedDelivery: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (shipment) {
      setFormData({
        shipperName: shipment.shipperName || '',
        carrierName: shipment.carrierName || '',
        pickupAddress: shipment.pickupLocation?.address || '',
        pickupCity: shipment.pickupLocation?.city || '',
        pickupState: shipment.pickupLocation?.state || '',
        pickupZipCode: shipment.pickupLocation?.zipCode || '',
        pickupCountry: shipment.pickupLocation?.country || 'USA',
        deliveryAddress: shipment.deliveryLocation?.address || '',
        deliveryCity: shipment.deliveryLocation?.city || '',
        deliveryState: shipment.deliveryLocation?.state || '',
        deliveryZipCode: shipment.deliveryLocation?.zipCode || '',
        deliveryCountry: shipment.deliveryLocation?.country || 'USA',
        trackingNumber: shipment.trackingNumber || '',
        status: shipment.status || 'PENDING',
        rate: shipment.rate || '',
        weight: shipment.weight || '',
        length: shipment.dimensions?.length || '',
        width: shipment.dimensions?.width || '',
        height: shipment.dimensions?.height || '',
        unit: shipment.dimensions?.unit || 'inches',
        estimatedDelivery: shipment.estimatedDelivery?.split('T')[0] || '',
        notes: shipment.notes || ''
      });
    }
  }, [shipment]);

  const [createShipment, { loading: creating }] = useMutation(CREATE_SHIPMENT, {
    onCompleted: () => {
      refetch();
      onClose();
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    }
  });

  const [updateShipment, { loading: updating }] = useMutation(UPDATE_SHIPMENT, {
    onCompleted: () => {
      refetch();
      onClose();
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shipperName.trim()) newErrors.shipperName = 'Shipper name is required';
    if (!formData.carrierName.trim()) newErrors.carrierName = 'Carrier name is required';
    if (!formData.pickupCity.trim()) newErrors.pickupCity = 'Pickup city is required';
    if (!formData.pickupState.trim()) newErrors.pickupState = 'Pickup state is required';
    if (!formData.deliveryCity.trim()) newErrors.deliveryCity = 'Delivery city is required';
    if (!formData.deliveryState.trim()) newErrors.deliveryState = 'Delivery state is required';
    if (!formData.trackingNumber.trim()) newErrors.trackingNumber = 'Tracking number is required';
    if (!formData.rate || formData.rate <= 0) newErrors.rate = 'Valid rate is required';
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Valid weight is required';
    if (!formData.estimatedDelivery) newErrors.estimatedDelivery = 'Estimated delivery is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const input = {
      shipperName: formData.shipperName,
      carrierName: formData.carrierName,
      pickupLocation: {
        address: formData.pickupAddress || 'N/A',
        city: formData.pickupCity,
        state: formData.pickupState,
        zipCode: formData.pickupZipCode || '00000',
        country: formData.pickupCountry
      },
      deliveryLocation: {
        address: formData.deliveryAddress || 'N/A',
        city: formData.deliveryCity,
        state: formData.deliveryState,
        zipCode: formData.deliveryZipCode || '00000',
        country: formData.deliveryCountry
      },
      status: formData.status,
      rate: parseFloat(formData.rate),
      weight: parseFloat(formData.weight),
      dimensions: {
        length: parseFloat(formData.length) || 0,
        width: parseFloat(formData.width) || 0,
        height: parseFloat(formData.height) || 0,
        unit: formData.unit
      },
      estimatedDelivery: new Date(formData.estimatedDelivery).toISOString(),
      notes: formData.notes
    };

    if (isEdit) {
      // For update, don't send trackingNumber
      delete input.trackingNumber;
      await updateShipment({
        variables: {
          id: shipment.id,
          input
        }
      });
    } else {
      // For create, include trackingNumber
      input.trackingNumber = formData.trackingNumber;
      await createShipment({
        variables: { input }
      });
    }
  };

  const loading = creating || updating;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content shipment-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Shipment' : 'Create New Shipment'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="shipment-form">
          {errors.submit && (
            <div className="form-error">{errors.submit}</div>
          )}

          <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Shipper Name *</label>
                <input
                  type="text"
                  name="shipperName"
                  value={formData.shipperName}
                  onChange={handleChange}
                  placeholder="e.g., Amazon Logistics"
                />
                {errors.shipperName && <span className="error">{errors.shipperName}</span>}
              </div>

              <div className="form-group">
                <label>Carrier Name *</label>
                <select
                  name="carrierName"
                  value={formData.carrierName}
                  onChange={handleChange}
                >
                  <option value="">Select Carrier</option>
                  <option value="FedEx Express">FedEx Express</option>
                  <option value="FedEx Ground">FedEx Ground</option>
                  <option value="UPS Ground">UPS Ground</option>
                  <option value="UPS Next Day Air">UPS Next Day Air</option>
                  <option value="DHL Express">DHL Express</option>
                  <option value="DHL International">DHL International</option>
                  <option value="USPS Priority">USPS Priority</option>
                </select>
                {errors.carrierName && <span className="error">{errors.carrierName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tracking Number *</label>
                <input
                  type="text"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleChange}
                  placeholder="TRK123456789"
                  disabled={isEdit}
                />
                {errors.trackingNumber && <span className="error">{errors.trackingNumber}</span>}
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Pickup Location</h4>
            <div className="form-row">
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="pickupCity"
                  value={formData.pickupCity}
                  onChange={handleChange}
                  placeholder="Seattle"
                />
                {errors.pickupCity && <span className="error">{errors.pickupCity}</span>}
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="pickupState"
                  value={formData.pickupState}
                  onChange={handleChange}
                  placeholder="WA"
                  maxLength="2"
                />
                {errors.pickupState && <span className="error">{errors.pickupState}</span>}
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="pickupZipCode"
                  value={formData.pickupZipCode}
                  onChange={handleChange}
                  placeholder="98101"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Delivery Location</h4>
            <div className="form-row">
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="456 Oak Avenue"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="deliveryCity"
                  value={formData.deliveryCity}
                  onChange={handleChange}
                  placeholder="Portland"
                />
                {errors.deliveryCity && <span className="error">{errors.deliveryCity}</span>}
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="deliveryState"
                  value={formData.deliveryState}
                  onChange={handleChange}
                  placeholder="OR"
                  maxLength="2"
                />
                {errors.deliveryState && <span className="error">{errors.deliveryState}</span>}
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="deliveryZipCode"
                  value={formData.deliveryZipCode}
                  onChange={handleChange}
                  placeholder="97201"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Shipment Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Rate ($) *</label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  placeholder="500.00"
                  step="0.01"
                  min="0"
                />
                {errors.rate && <span className="error">{errors.rate}</span>}
              </div>
              <div className="form-group">
                <label>Weight (lbs) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="100"
                  step="0.1"
                  min="0"
                />
                {errors.weight && <span className="error">{errors.weight}</span>}
              </div>
              <div className="form-group">
                <label>Estimated Delivery *</label>
                <input
                  type="date"
                  name="estimatedDelivery"
                  value={formData.estimatedDelivery}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.estimatedDelivery && <span className="error">{errors.estimatedDelivery}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Length</label>
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="48"
                  step="0.1"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Width</label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="40"
                  step="0.1"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Height</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="36"
                  step="0.1"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any special instructions or notes..."
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Shipment' : 'Create Shipment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShipmentForm;

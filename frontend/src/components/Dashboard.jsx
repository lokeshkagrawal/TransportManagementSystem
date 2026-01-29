import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SHIPMENTS, GET_SHIPMENT_STATS } from '../graphql';
import { useDebounce } from '../hooks/useDebounce';
import {
  Menu,
  Search,
  Grid3x3,
  Grid2x2,
  Plus,
  Package,
  Truck,
  FileText,
  Settings,
  BarChart3,
  Users,
  LogOut
} from 'lucide-react';
import GridView from './GridView';
import TileView from './TileView';
import ShipmentDetail from './ShipmentDetail';
import ShipmentForm from './ShipmentForm';
import StatsCards from './StatsCards';

function Dashboard({ setIsAuthenticated }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchInput, setSearchInput] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [editingShipment, setEditingShipment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    carrier: ''
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'createdAt',
    order: 'DESC'
  });
  const [pagination, setPagination] = useState({
    after: null,
    before: null
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Mobile पर page load होते ही sidebar close रखो
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  }, []);

  // Debounce search input to reduce API calls (Performance optimization)
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  const itemsPerPage = 10;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_SHIPMENTS, {
    variables: {
      first: itemsPerPage,
      after: pagination.after,
      filter: {
        ...(filters.status && { status: filters.status }),
        ...(filters.carrier && { carrierName: filters.carrier }),
        ...(debouncedSearchTerm && { searchTerm: debouncedSearchTerm })
      },
      sort: sortConfig
    },
    fetchPolicy: 'cache-and-network' // Use cache + check for updates
  });

  const { data: statsData } = useQuery(GET_SHIPMENT_STATS, {
    skip: user?.role !== 'ADMIN',
    fetchPolicy: 'network-only'
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const handleShipmentClick = (shipment) => {
    setSelectedShipment(shipment);
  };

  const handleCloseDetail = () => {
    setSelectedShipment(null);
    refetch();
  };

  const handleNewShipment = () => {
    setEditingShipment(null);
    setShowForm(true);
  };

  const handleEditShipment = (shipment) => {
    setEditingShipment(shipment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingShipment(null);
    refetch();
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    const [field, order] = value.split('-');
    setSortConfig({ field, order: order.toUpperCase() });
    setPagination({ after: null, before: null }); // Reset pagination on sort change
  };

  const handleNextPage = () => {
    if (data?.shipments?.pageInfo?.hasNextPage) {
      setPagination({
        after: data.shipments.pageInfo.endCursor,
        before: null
      });
    }
  };

  const handlePreviousPage = () => {
    if (data?.shipments?.pageInfo?.hasPreviousPage) {
      setPagination({
        after: null,
        before: data.shipments.pageInfo.startCursor
      });
    }
  };

  const handleFirstPage = () => {
    setPagination({ after: null, before: null });
  };

  const shipments = data?.shipments?.edges?.map(edge => edge.node) || [];
  const pageInfo = data?.shipments?.pageInfo || {};
  const totalCount = data?.shipments?.totalCount || 0;

  // Calculate current page (approximate)
  const currentPage = pagination.after ? Math.ceil(shipments.length / itemsPerPage) + 1 : 1;

  return (
    <div className="app">
      {/* Sidebar */}
      {!sidebarCollapsed && window.innerWidth <= 768 && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarCollapsed(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99,
            cursor: 'pointer'
          }}
        />
      )}

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h1>TMS Portal</h1>
          <p>Transportation Management</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Main Menu</div>

          <a href="#dashboard" className="nav-item active">
            <BarChart3 />
            <span>Dashboard</span>
          </a>

          <a href="#shipments" className="nav-item">
            <Package />
            <span>Shipments</span>
          </a>
          <div className="submenu">
            <a
              href="#all-shipments"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                setFilters({ status: '', carrier: '' });
                setPagination({ after: null, before: null });
                if (window.innerWidth <= 768) {
                  setSidebarCollapsed(true);
                }
              }}
            >
              All Shipments
            </a>
            <a
              href="#pending"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                setFilters({ status: 'PENDING', carrier: '' });
                setPagination({ after: null, before: null });
                if (window.innerWidth <= 768) {
                  setSidebarCollapsed(true);
                }
              }}
            >
              Pending
            </a>
            <a
              href="#in-transit"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                setFilters({ status: 'IN_TRANSIT', carrier: '' });
                setPagination({ after: null, before: null });
                if (window.innerWidth <= 768) {
                  setSidebarCollapsed(true);
                }
              }}
            >
              In Transit
            </a>
            <a
              href="#delivered"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                setFilters({ status: 'DELIVERED', carrier: '' });
                setPagination({ after: null, before: null });
                if (window.innerWidth <= 768) {
                  setSidebarCollapsed(true);
                }
              }}
            >
              Delivered
            </a>
          </div>

          <a href="#carriers" className="nav-item">
            <Truck />
            <span>Carriers</span>
          </a>

          <a href="#reports" className="nav-item">
            <FileText />
            <span>Reports</span>
          </a>

          {user?.role === 'ADMIN' && (
            <>
              <div className="nav-section">Admin</div>

              <a href="#users" className="nav-item">
                <Users />
                <span>Users</span>
              </a>

              <a href="#settings" className="nav-item">
                <Settings />
                <span>Settings</span>
              </a>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h4>{user?.name}</h4>
              <p>{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <button
              className="hamburger-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu />
            </button>

            <div className="horizontal-menu">
              <button
                className={!filters.status ? 'active' : ''}
                onClick={() => {
                  setFilters({ status: '', carrier: '' });
                  setPagination({ after: null, before: null });
                  if (window.innerWidth <= 768) {
                    setSidebarCollapsed(true);
                  }
                }}
              >
                All Shipments
              </button>
              <button
                className={filters.status === 'PENDING' ? 'active' : ''}
                onClick={() => {
                  setFilters({ status: 'PENDING', carrier: '' });
                  setPagination({ after: null, before: null });
                  if (window.innerWidth <= 768) {
                    setSidebarCollapsed(true);
                  }
                }}
              >
                Pending
              </button>
              <button
                className={filters.status === 'IN_TRANSIT' ? 'active' : ''}
                onClick={() => {
                  setFilters({ status: 'IN_TRANSIT', carrier: '' });
                  setPagination({ after: null, before: null });
                  if (window.innerWidth <= 768) {
                    setSidebarCollapsed(true);
                  }
                }}
              >
                In Transit
              </button>
              <button
                className={filters.status === 'DELIVERED' ? 'active' : ''}
                onClick={() => {
                  setFilters({ status: 'DELIVERED', carrier: '' });
                  setPagination({ after: null, before: null });
                  if (window.innerWidth <= 768) {
                    setSidebarCollapsed(true);
                  }
                }}
              >
                Delivered
              </button>
            </div>
          </div>

          <div className="top-bar-right">
            <div className="search-box">
              <Search />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPagination({ after: null, before: null });
                  if (window.innerWidth <= 768) {
                    setSidebarCollapsed(true);
                  }
                }}
              />
            </div>

            <div className="view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid3x3 />
              </button>
              <button
                className={viewMode === 'tile' ? 'active' : ''}
                onClick={() => setViewMode('tile')}
                title="Tile View"
              >
                <Grid2x2 />
              </button>
            </div>

            <button className="btn-primary" onClick={handleNewShipment}>
              <Plus size={20} />
              New Shipment
            </button>

            <button className="hamburger-btn" onClick={handleLogout} title="Logout">
              <LogOut />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <div className="content-header">
            <h2>Shipments Overview</h2>
            <p>Manage and track all your shipments in one place</p>
          </div>

          {/* Stats Cards - Admin Only */}
          {user?.role === 'ADMIN' && statsData && (
            <StatsCards stats={statsData.shipmentStats} />
          )}

          {/* Filters */}
          <div className="filters-bar">
            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setPagination({ after: null, before: null });
                }}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Carrier</label>
              <select
                value={filters.carrier}
                onChange={(e) => {
                  setFilters({ ...filters, carrier: e.target.value });
                  setPagination({ after: null, before: null });
                }}
              >
                <option value="">All Carriers</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="DHL">DHL</option>
                <option value="USPS">USPS</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={`${sortConfig.field}-${sortConfig.order.toLowerCase()}`}
                onChange={handleSortChange}
              >
                <option value="createdAt-desc">Latest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="rate-desc">Highest Rate</option>
                <option value="rate-asc">Lowest Rate</option>
                <option value="weight-desc">Heaviest First</option>
                <option value="weight-asc">Lightest First</option>
                <option value="estimatedDelivery-asc">Delivery Date (Earliest)</option>
                <option value="estimatedDelivery-desc">Delivery Date (Latest)</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Results</label>
              <div style={{ paddingTop: '0.625rem', fontWeight: '600' }}>
                {totalCount} total shipments
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-message">
              Error loading shipments: {error.message}
            </div>
          )}

          {/* Data Views */}
          {!loading && !error && (
            <>
              {viewMode === 'grid' ? (
                <GridView
                  shipments={shipments}
                  onShipmentClick={handleShipmentClick}
                  onEditClick={handleEditShipment}   // ✅ YE ADD KARO
                  refetch={refetch}
                />
              ) : (
                <TileView
                  shipments={shipments}
                  onShipmentClick={handleShipmentClick}
                  onEditClick={handleEditShipment}
                  refetch={refetch}
                />
              )}

              {/* Pagination */}
              {totalCount > 0 && (
                <div className="pagination">
                  <button
                    onClick={handleFirstPage}
                    disabled={!pagination.after && !pagination.before}
                    title="First Page"
                  >
                    First
                  </button>
                  <button
                    onClick={handlePreviousPage}
                    disabled={!pageInfo.hasPreviousPage}
                    title="Previous Page"
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Showing {shipments.length} of {totalCount} shipments
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!pageInfo.hasNextPage}
                    title="Next Page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Shipment Detail Modal */}
      {selectedShipment && (
        <ShipmentDetail
          shipment={selectedShipment}
          onClose={handleCloseDetail}
        />
      )}

      {/* Shipment Form Modal */}
      {showForm && (
        <ShipmentForm
          shipment={editingShipment}
          onClose={handleCloseForm}
          refetch={refetch}
        />
      )}
    </div>
  );
}

export default Dashboard;

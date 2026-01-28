import React from 'react';
import { Package, Clock, CheckCircle, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

function StatsCards({ stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statsConfig = [
    {
      title: 'Total Shipments',
      value: stats.totalShipments,
      icon: Package,
      color: 'primary'
    },
    {
      title: 'In Transit',
      value: stats.inTransitShipments,
      icon: Clock,
      color: 'accent'
    },
    {
      title: 'Delivered',
      value: stats.deliveredShipments,
      icon: CheckCircle,
      color: 'success'
    },
    {
      title: 'Pending',
      value: stats.pendingShipments,
      icon: TrendingUp,
      color: 'warning'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'success'
    },
    {
      title: 'Average Rate',
      value: formatCurrency(stats.averageRate),
      icon: BarChart3,
      color: 'primary'
    }
  ];

  return (
    <div className="stats-grid">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <Icon size={28} />
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;

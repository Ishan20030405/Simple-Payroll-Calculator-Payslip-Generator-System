// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Calculator, 
  FileText, BarChart2, LogOut, 
  Search, Bell, ChevronDown,
  Plus, Download, Printer,
  AlertCircle, DollarSign,
  TrendingUp, UserCheck
} from 'lucide-react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout, api } = useAuth();
  const navigate = useNavigate();
  const [employeeStats, setEmployeeStats] = useState({ 
    total: 0, 
    active: 0, 
    inactive: 0 
  });
  const [recentPayrolls, setRecentPayrolls] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch employee stats
      const statsResponse = await api.get('/employees/stats');
      setEmployeeStats(statsResponse.data);

      // Fetch recent payrolls
      const payrollResponse = await api.get('/payrolls/recent');
      setRecentPayrolls(payrollResponse.data);

      // Fetch alerts
      const alertsResponse = await api.get('/alerts');
      setAlerts(alertsResponse.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Set fallback data
      setEmployeeStats({ total: 120, active: 112, inactive: 8 });
      setRecentPayrolls([
        { id: 1, month: 'May 2026', employees: 120, gross: '1,245,000', net: '967,500', status: 'Completed' },
        { id: 2, month: 'April 2026', employees: 118, gross: '1,198,000', net: '928,300', status: 'Completed' },
        { id: 3, month: 'March 2026', employees: 115, gross: '1,150,000', net: '890,200', status: 'Completed' },
      ]);
      setAlerts([
        { id: 1, message: '5 employees attendance not updated', type: 'warning' },
        { id: 2, message: 'Tax configuration not updated for 2026', type: 'danger' },
        { id: 3, message: 'Generate May 2026 payroll', type: 'info' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed: Single click logout
  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate('/login');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">N</span>
          Northfield
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          
          <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Users size={18} /> Employees
          </NavLink>

          <NavLink to="/payroll" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Calculator size={18} /> Payroll
          </NavLink>

          <NavLink to="/payslips" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FileText size={18} /> Payslips
          </NavLink>          

          <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <BarChart2 size={18} /> Reports
          </NavLink>
        </nav>

        {/* ✅ Fixed Logout */}
        <div className="sidebar-footer">
          <div 
            className="nav-item logout-btn" 
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                logout();
                navigate('/login');
              }
            }}
          >
            <LogOut size={18} /> Log out
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="global-search">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search employees, payslips..." />
          </div>
          
          <div className="topbar-actions">
            <Bell size={20} className="bell-icon" />
            <div className="user-profile">
              <div className="user-avatar">
                {user?.fullName ? getInitials(user.fullName) : 'A'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.fullName || user?.username || 'Admin'}</span>
                <span className="user-role">{user?.role || 'Admin'}</span>
              </div>
              <ChevronDown size={16} color="#6b7280" />
            </div>
          </div>
        </header>

        <main className="page-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Users size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{employeeStats.total}</span>
                <span className="stat-label">Total Employees</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon green">
                <UserCheck size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{employeeStats.active}</span>
                <span className="stat-label">Active Employees</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon purple">
                <DollarSign size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">
                  {formatCurrency(employeeStats.total * 85000 || 0)}
                </span>
                <span className="stat-label">Monthly Payroll</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon orange">
                <TrendingUp size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{alerts.length}</span>
                <span className="stat-label">Pending Requests</span>
              </div>
            </div>
          </div>

          {/* Recent Payrolls & Alerts */}
          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Recent Payroll Runs</h3>
                <button className="btn-outline" onClick={() => navigate('/payroll')}>
                  View All
                </button>
              </div>
              <div className="card-body">
                {recentPayrolls.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Payroll Month</th>
                        <th>Employees</th>
                        <th>Total Gross</th>
                        <th>Total Net</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayrolls.map((payroll, index) => (
                        <tr key={payroll.id}>
                          <td>{index + 1}</td>
                          <td>{payroll.month}</td>
                          <td>{payroll.employees}</td>
                          <td>Rs. {payroll.gross}</td>
                          <td>Rs. {payroll.net}</td>
                          <td>
                            <span className={`status-badge ${payroll.status?.toLowerCase() || 'completed'}`}>
                              {payroll.status || 'Completed'}
                            </span>
                          </td>
                          <td>
                            <button className="icon-btn">
                              <FileText size={14} />
                            </button>
                            <button className="icon-btn">
                              <Printer size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted text-center">No payroll records found</p>
                )}
              </div>
            </div>

            <div className="card alerts-card">
              <div className="card-header">
                <h3>⚠️ Alerts</h3>
                <span className="badge">{alerts.length}</span>
              </div>
              <div className="card-body">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div key={alert.id} className={`alert-item ${alert.type}`}>
                      <AlertCircle size={16} />
                      <span>{alert.message}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center">No alerts</p>
                )}
                <button className="btn-outline full-width">View All Alerts</button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="card">
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="card-body quick-actions-grid">
                <button className="action-btn primary" onClick={() => navigate('/employees')}>
                  <Plus size={18} /> Add Employee
                </button>
                <button className="action-btn success" onClick={() => navigate('/payroll')}>
                  <Calculator size={18} /> Process Payroll
                </button>
                <button className="action-btn info" onClick={() => navigate('/payslips')}>
                  <FileText size={18} /> Generate Payslip
                </button>
                <button className="action-btn warning" onClick={() => navigate('/reports')}>
                  <Download size={18} /> Export Reports
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
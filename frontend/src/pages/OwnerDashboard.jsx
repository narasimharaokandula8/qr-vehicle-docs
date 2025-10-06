import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'owner') {
        navigate('/dashboard'); // Redirect to appropriate dashboard
        return;
      }
      setUserData(decoded);
      fetchVehicles(decoded.id);
    } catch (error) {
      console.error('Invalid token:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchVehicles = async (ownerId) => {
    try {
      const response = await axios.get(`http://localhost:5174/api/accessible-vehicles/${ownerId}`);
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ownerId');
    navigate('/');
  };

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'vehicles', label: 'My Vehicles', icon: '🚗' },
    { id: 'drivers', label: 'Drivers', icon: '👨‍✈️' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'qrcodes', label: 'QR Codes', icon: '📱' },
    { id: 'payments', label: 'Payments', icon: '💳' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="dashboard-content">
            <h2>👤 My Profile</h2>
            <div className="profile-card">
              <div className="profile-info">
                <h3>Welcome, {userData?.name}!</h3>
                <p><strong>Email:</strong> {userData?.email}</p>
                <p><strong>Role:</strong> Vehicle Owner</p>
                <p><strong>Member since:</strong> {new Date().toLocaleDateString()}</p>
              </div>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{vehicles.length}</span>
                  <span className="stat-label">Registered Vehicles</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Assigned Drivers</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'vehicles':
        return (
          <div className="dashboard-content">
            <h2>🚗 My Vehicles</h2>
            <div className="vehicles-grid">
              {vehicles.length === 0 ? (
                <div className="empty-state">
                  <p>No vehicles registered yet.</p>
                  <button onClick={() => navigate('/upload')} className="primary-btn">
                    Add Your First Vehicle
                  </button>
                </div>
              ) : (
                vehicles.map(vehicle => (
                  <div key={vehicle._id} className="vehicle-card">
                    <h4>{vehicle.vehicleNo}</h4>
                    <p>Documents: {vehicle.rc ? '✅' : '❌'} RC | {vehicle.insurance ? '✅' : '❌'} Insurance</p>
                    <p>Added: {new Date(vehicle.createdAt).toLocaleDateString()}</p>
                    <div className="vehicle-actions">
                      <button className="secondary-btn">View Details</button>
                      <button className="primary-btn">Generate QR</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      
      case 'drivers':
        return (
          <div className="dashboard-content">
            <h2>👨‍✈️ Manage Drivers</h2>
            <div className="drivers-section">
              <div className="empty-state">
                <p>No drivers assigned yet.</p>
                <button className="primary-btn">Assign Driver</button>
              </div>
            </div>
          </div>
        );
      
      case 'documents':
        return (
          <div className="dashboard-content">
            <h2>📄 Document Management</h2>
            <div className="documents-grid">
              <button onClick={() => navigate('/upload')} className="upload-card">
                <span className="upload-icon">📤</span>
                <h4>Upload New Documents</h4>
                <p>Add vehicle documents and generate QR codes</p>
              </button>
            </div>
          </div>
        );
      
      case 'qrcodes':
        return (
          <div className="dashboard-content">
            <h2>📱 QR Code Management</h2>
            <div className="qr-section">
              <div className="empty-state">
                <p>Upload vehicle documents to generate QR codes.</p>
                <button onClick={() => navigate('/upload')} className="primary-btn">
                  Upload Documents
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'payments':
        return (
          <div className="dashboard-content">
            <h2>💳 Payment History</h2>
            <div className="payments-section">
              <div className="empty-state">
                <p>No payment history available.</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="owner-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🚗 VehicleDoc Pro</h1>
          <span className="user-greeting">Welcome, {userData.name}</span>
        </div>
        <div className="header-right">
          <button onClick={handleLogout} className="logout-btn">
            Logout 🚪
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>

      <style jsx>{`
        .owner-dashboard {
          min-height: 100vh;
          background: #f4f6f8;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #0048b4 0%, #00c2ff 100%);
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-left h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .user-greeting {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-left: 1rem;
        }

        .logout-btn {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .dashboard-layout {
          display: flex;
          min-height: calc(100vh - 80px);
        }

        .dashboard-sidebar {
          width: 250px;
          background: white;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          padding: 2rem 0;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          padding: 1rem 2rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .sidebar-item:hover {
          background: #f8f9fa;
        }

        .sidebar-item.active {
          background: #e3f2fd;
          border-left-color: #0048b4;
          color: #0048b4;
          font-weight: 600;
        }

        .sidebar-icon {
          font-size: 1.2rem;
          margin-right: 1rem;
        }

        .sidebar-label {
          font-size: 1rem;
        }

        .dashboard-main {
          flex: 1;
          padding: 2rem;
        }

        .dashboard-content h2 {
          color: #0048b4;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .profile-info h3 {
          color: #0048b4;
          margin-bottom: 1rem;
          font-size: 1.4rem;
        }

        .profile-info p {
          margin: 0.5rem 0;
          color: #666;
        }

        .profile-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #0048b4;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
        }

        .vehicles-grid, .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .vehicle-card, .upload-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .vehicle-card:hover, .upload-card:hover {
          transform: translateY(-2px);
        }

        .upload-card {
          text-align: center;
          cursor: pointer;
          border: 2px dashed #00c2ff;
        }

        .upload-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .vehicle-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .primary-btn, .secondary-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .primary-btn {
          background: linear-gradient(135deg, #0048b4 0%, #00c2ff 100%);
          color: white;
        }

        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,72,180,0.3);
        }

        .secondary-btn {
          background: #f8f9fa;
          color: #666;
          border: 1px solid #ddd;
        }

        .secondary-btn:hover {
          background: #e9ecef;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .empty-state p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
          color: #0048b4;
        }
      `}</style>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [assignedVehicles, setAssignedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'driver') {
        navigate('/dashboard');
        return;
      }
      setUserData(decoded);
      fetchAssignedVehicles(decoded.id);
    } catch (error) {
      console.error('Invalid token:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchAssignedVehicles = async (driverId) => {
    try {
      // This would fetch vehicles assigned to this driver
      // For now, we'll use a placeholder
      setAssignedVehicles([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assigned vehicles:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ownerId');
    navigate('/');
  };

  const handleQRAccess = (vehicleId) => {
    // Navigate to QR scanner or show QR code
    navigate(`/qrscanner?vehicle=${vehicleId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your assigned vehicles...</p>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>👨‍✈️ Driver Portal</h1>
            <span className="welcome-text">Welcome, {userData?.name}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout 🚪
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-info">
                <span className="stat-number">{assignedVehicles.length}</span>
                <span className="stat-label">Assigned Vehicles</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📱</div>
              <div className="stat-info">
                <span className="stat-number">0</span>
                <span className="stat-label">QR Scans Today</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛣️</div>
              <div className="stat-info">
                <span className="stat-number">0</span>
                <span className="stat-label">Routes Completed</span>
              </div>
            </div>
          </div>

          {/* Assigned Vehicles */}
          <section className="vehicles-section">
            <h2>🚗 My Assigned Vehicles</h2>
            
            {assignedVehicles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🚫</div>
                <h3>No Vehicles Assigned</h3>
                <p>Contact your fleet manager to get vehicle access permissions.</p>
                <div className="empty-actions">
                  <button className="contact-btn" onClick={() => alert('Contact feature coming soon!')}>
                    📞 Contact Manager
                  </button>
                </div>
              </div>
            ) : (
              <div className="vehicles-grid">
                {assignedVehicles.map(vehicle => (
                  <div key={vehicle.id} className="vehicle-card">
                    <div className="vehicle-header">
                      <h4 className="vehicle-number">{vehicle.vehicleNo}</h4>
                      <span className="vehicle-type">{vehicle.type || 'Vehicle'}</span>
                    </div>
                    
                    <div className="vehicle-info">
                      <div className="info-row">
                        <span className="info-label">Owner:</span>
                        <span className="info-value">{vehicle.owner}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Status:</span>
                        <span className="status-active">✅ Active</span>
                      </div>
                    </div>

                    <div className="vehicle-actions">
                      <button 
                        className="qr-btn"
                        onClick={() => handleQRAccess(vehicle.id)}
                      >
                        📱 Access QR
                      </button>
                      <button className="route-btn">
                        🗺️ View Routes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="actions-section">
            <h3>⚡ Quick Actions</h3>
            <div className="actions-grid">
              <button 
                className="action-card"
                onClick={() => navigate('/qrscanner')}
              >
                <div className="action-icon">📱</div>
                <div className="action-text">
                  <h4>QR Scanner</h4>
                  <p>Scan vehicle QR codes</p>
                </div>
              </button>
              
              <button 
                className="action-card"
                onClick={() => navigate('/vehicle-tracking')}
              >
                <div className="action-icon">🗺️</div>
                <div className="action-text">
                  <h4>Route Planner</h4>
                  <p>Plan optimal routes</p>
                </div>
              </button>
              
              <button 
                className="action-card"
                onClick={() => navigate('/profile')}
              >
                <div className="action-icon">👤</div>
                <div className="action-text">
                  <h4>My Profile</h4>
                  <p>Update driver details</p>
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .driver-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f4f6f8 0%, #e8f4f8 100%);
        }

        .dashboard-header {
          background: linear-gradient(135deg, #0048b4 0%, #00c2ff 100%);
          color: white;
          padding: 1.5rem 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-left h1 {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 600;
        }

        .welcome-text {
          font-size: 0.95rem;
          opacity: 0.9;
          display: block;
          margin-top: 0.25rem;
        }

        .logout-btn {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }

        .dashboard-main {
          padding: 2rem;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .stat-icon {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .stat-number {
          display: block;
          font-size: 1.8rem;
          font-weight: bold;
          color: #0048b4;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
        }

        .vehicles-section, .actions-section {
          margin-bottom: 2rem;
        }

        .vehicles-section h2, .actions-section h3 {
          color: #0048b4;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .empty-state {
          background: white;
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #0048b4;
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .contact-btn {
          background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .contact-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(67,160,71,0.3);
        }

        .vehicles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .vehicle-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
        }

        .vehicle-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .vehicle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .vehicle-number {
          color: #0048b4;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
        }

        .vehicle-type {
          background: #e3f2fd;
          color: #0048b4;
          padding: 0.25rem 0.75rem;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .vehicle-info {
          margin-bottom: 1.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .info-label {
          color: #666;
          font-weight: 500;
        }

        .info-value {
          color: #333;
          font-weight: 600;
        }

        .status-active {
          color: #43a047;
          font-weight: 600;
        }

        .vehicle-actions {
          display: flex;
          gap: 0.75rem;
        }

        .qr-btn, .route-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .qr-btn {
          background: linear-gradient(135deg, #0048b4 0%, #00c2ff 100%);
          color: white;
        }

        .qr-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,72,180,0.3);
        }

        .route-btn {
          background: #f8f9fa;
          color: #666;
          border: 1px solid #ddd;
        }

        .route-btn:hover {
          background: #e9ecef;
          color: #333;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: white;
          border: none;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          text-align: left;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .action-icon {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .action-text h4 {
          color: #0048b4;
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }

        .action-text p {
          color: #666;
          margin: 0;
          font-size: 0.9rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #0048b4;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e3f2fd;
          border-top: 4px solid #0048b4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
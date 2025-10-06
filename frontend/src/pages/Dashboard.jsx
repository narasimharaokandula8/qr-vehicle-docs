
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faUpload } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
            <h1>Welcome to the Dashboard</h1>
            <div style={{ display: "flex", gap: "2rem", margin: "2rem 0" }}>
                <Link to="/upload" style={{ textDecoration: 'none', color: '#0ea5e9', fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FontAwesomeIcon icon={faUpload} /> Upload Documents
                </Link>
                <Link to="/qrscanner" style={{ textDecoration: 'none', color: '#0ea5e9', fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FontAwesomeIcon icon={faQrcode} /> QR Scanner
                </Link>
            </div>
        </div>
    );
}
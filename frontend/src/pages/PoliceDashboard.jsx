
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function PoliceDashboard() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
            <h1>Police Dashboard</h1>
            <Link to="/qrscanner" style={{ marginTop: 24, fontSize: 32, color: "#0ea5e9" }}>
                <FontAwesomeIcon icon={faQrcode} />
                <span style={{ marginLeft: 12, fontSize: 18 }}>Scan QR</span>
            </Link>
        </div>
    );
}
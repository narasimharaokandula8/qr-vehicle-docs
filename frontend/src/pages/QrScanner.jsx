

import React, { useState } from "react";
import axios from "axios";

export default function QrScanner() {
    const [qrData, setQrData] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    // For demo: allow manual QR data input (simulate scanning)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        try {
            const res = await axios.post("http://localhost:5174/api/scan-qr", { qrData, fromApp: true });
            setResult(res.data.document);
        } catch (err) {
            setError(err.response?.data?.message || "Scan failed");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
            <h1>QR Scanner</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                <label>Paste QR Data (for demo):</label>
                <input
                    type="text"
                    value={qrData}
                    onChange={e => setQrData(e.target.value)}
                    style={{ width: 400, maxWidth: "90%" }}
                    placeholder="Paste QR code data here"
                    required
                />
                <button type="submit">Scan</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {result && (
                <div style={{ background: "#fff", borderRadius: 8, padding: 24, boxShadow: "0 2px 8px #0001", maxWidth: 600 }}>
                    <h3>Document Data</h3>
                    <pre style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
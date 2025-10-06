import React, { useState } from "react";
import axios from "axios";

const UploadDocs = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [rc, setRc] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [puc, setPuc] = useState(null);
  const [fitness, setFitness] = useState(null);
  const [message, setMessage] = useState("");

  // get ownerId from localStorage
  const ownerId = localStorage.getItem("ownerId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ownerId) return setMessage("User not logged in");

    const formData = new FormData();
    formData.append("vehicleNo", vehicleNo);
    formData.append("ownerId", ownerId);
    formData.append("rc", rc);
    formData.append("insurance", insurance);
    formData.append("puc", puc);
    formData.append("fitness", fitness);

    try {
      const res = await axios.post("http://localhost:5174/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      // clear form
      setVehicleNo("");
      setRc(null);
      setInsurance(null);
      setPuc(null);
      setFitness(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Upload Vehicle Documents</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Vehicle Number:</label>
          <input
            type="text"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>RC:</label>
          <input type="file" onChange={(e) => setRc(e.target.files[0])} required />
        </div>
        <div>
          <label>Insurance:</label>
          <input type="file" onChange={(e) => setInsurance(e.target.files[0])} required />
        </div>
        <div>
          <label>PUC:</label>
          <input type="file" onChange={(e) => setPuc(e.target.files[0])} required />
        </div>
        <div>
          <label>Fitness:</label>
          <input type="file" onChange={(e) => setFitness(e.target.files[0])} required />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>Upload</button>
      </form>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default UploadDocs;

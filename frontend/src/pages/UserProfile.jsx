import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function UserProfile({ showToast, setLoading }) {
  const token = localStorage.getItem("token");
  let userId = "";
  let userEmail = "";
  let userName = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
      userEmail = decoded.email;
      userName = decoded.name || "";
    } catch {
      showToast && showToast("Invalid token", "error");
    }
  }
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    setAvatar(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!avatar) return showToast("Please select an image", "error");
    setLoading && setLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar);
    try {
  await axios.post(`http://localhost:5174/api/user/${userId}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast && showToast("Avatar uploaded!", "success");
    } catch {
      showToast && showToast("Upload failed", "error");
    } finally {
      setLoading && setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
      <h2>User Profile</h2>
      <p><b>Name:</b> {userName}</p>
      <p><b>Email:</b> {userEmail}</p>
      <form onSubmit={handleUpload}>
        <label>Upload Avatar:</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {preview && <img src={preview} alt="avatar" style={{ width: 80, height: 80, borderRadius: "50%", margin: "1rem 0" }} />}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

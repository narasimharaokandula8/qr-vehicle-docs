
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        newPass: "",
        confirmPass: "",
        DOB: "",
        address: "",
        role: "owner"
    });
    const [error, setError] = useState("");
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.newPass !== formData.confirmPass) {
            setError("Passwords do not match");
            return;
        }
        try {
            await axios.post("http://localhost:5174/api/register", {
                name: formData.name,
                email: formData.email,
                phone: formData.phoneNumber,
                password: formData.newPass,
                dob: formData.DOB,
                address: formData.address,
                role: formData.role
            });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };
    return (
        <form onSubmit={handleSignup}>
            <fieldset>
                <legend>Sign Up</legend>
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    name="name"
                    id="fullName"
                    placeholder="Enter Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email ID"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="newPass">Create Password</label>
                <input
                    type="password"
                    name="newPass"
                    id="newPass"
                    placeholder="Enter New Password"
                    value={formData.newPass}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="confirmPass">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPass"
                    id="confirmPass"
                    placeholder="Enter Confirm Password"
                    value={formData.confirmPass}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="role">I am a:</label>
                <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="owner">🚗 Vehicle Owner</option>
                    <option value="driver">👨‍✈️ Vehicle Driver</option>
                    <option value="police">👮‍♂️ Police Officer</option>
                </select>
                <label htmlFor="DOB">Date of Birth</label>
                <input type="date" name="DOB" id="DOB" value={formData.DOB} onChange={handleChange} />
                <label htmlFor="address">Address</label>
                <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="City, Pincode, State"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="profilePic">Profile Photo</label>
                <input type="file" accept="image/*" />
                <button type="submit">Sign Up</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>
        </form>
    );
}
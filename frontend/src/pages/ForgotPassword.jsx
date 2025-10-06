
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const handleForgotPass = e => {
        e.preventDefault();
        navigate("/login");
    };
    return (
        <form onSubmit={handleForgotPass}>
            <fieldset>
                <legend>Forgot Password</legend>
                <label htmlFor="username">Email</label>
                <input
                    type="email"
                    name="username"
                    id="username"
                    placeholder="Enter email"
                    required
                />
                <label htmlFor="newPass">Create Password</label>
                <input
                    type="password"
                    name="newPass"
                    id="newPass"
                    placeholder="Enter New Password"
                    required
                />
                <label htmlFor="confirmPass">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPass"
                    id="confirmPass"
                    placeholder="Enter Confirm Password"
                    required
                />
                <label htmlFor="otp">Enter 5-Digit OTP</label>
                <input type="number" name="otp" id="otp" minLength={5} maxLength={5} required />
                <button type="submit">Submit</button>
            </fieldset>
        </form>
    );
}
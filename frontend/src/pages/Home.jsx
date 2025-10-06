import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaQrcode, FaShieldAlt, FaMobileAlt, FaCheckCircle, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";

export default function Home() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);

    const features = [
        {
            icon: <FaCar className="text-4xl text-primary" />,
            title: "Multi-Vehicle Management",
            description: "Manage multiple vehicles under one account with separate QR codes"
        },
        {
            icon: <FaQrcode className="text-4xl text-secondary" />,
            title: "QR Code Generation",
            description: "Generate secure QR codes for instant document verification"
        },
        {
            icon: <FaShieldAlt className="text-4xl text-accent-green" />,
            title: "End-to-End Security",
            description: "Documents are encrypted and accessible only to authorized personnel"
        },
        {
            icon: <FaMobileAlt className="text-4xl text-accent-orange" />,
            title: "Mobile Friendly",
            description: "Access your documents anywhere, anytime on any device"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [features.length]);

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="flex items-center justify-between">
                        <div className="nav-brand flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <FaCar className="text-white text-xl" />
                            </div>
                            <span className="font-bold text-xl">VehicleDoc Pro</span>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex nav-links">
                            <a href="#features" className="nav-link">Features</a>
                            <a href="#how-it-works" className="nav-link">How It Works</a>
                            <a href="#contact" className="nav-link">Contact</a>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate("/login")}
                                className="btn btn-secondary"
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => navigate("/signup")}
                                className="btn btn-primary"
                            >
                                Sign Up
                            </button>
                            
                            {/* Mobile menu button */}
                            <button 
                                className="md:hidden text-gray-600 text-xl"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 glass p-4 rounded-lg">
                            <div className="flex flex-col gap-2">
                                <a href="#features" className="nav-link text-center py-2">Features</a>
                                <a href="#how-it-works" className="nav-link text-center py-2">How It Works</a>
                                <a href="#contact" className="nav-link text-center py-2">Contact</a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-20">
                <section className="container py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left animate-fadeIn">
                            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                                Vehicle Document
                                <span className="text-primary"> Management</span>
                                <br />
                                <span className="text-secondary">Made Simple</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Store, manage, and verify your vehicle documents digitally with 
                                secure QR codes. Perfect for vehicle owners and traffic police.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button 
                                    onClick={() => navigate("/signup")}
                                    className="btn btn-primary btn-lg flex items-center gap-2"
                                >
                                    Get Started <FaArrowRight />
                                </button>
                                <button 
                                    onClick={() => navigate("/qrscanner")}
                                    className="btn btn-outline btn-lg flex items-center gap-2"
                                >
                                    <FaQrcode /> Try QR Scanner
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex justify-center">
                            <div className="card-glass p-8 max-w-md w-full animate-slideIn">
                                <div className="text-center">
                                    <h3 className="card-title">Dashboard Preview</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <FaCheckCircle className="text-accent-green" />
                                            <span>User Registration</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaCheckCircle className="text-accent-green" />
                                            <span>Document Upload</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaCheckCircle className="text-accent-green" />
                                            <span>QR Code Generation</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaCheckCircle className="text-accent-green" />
                                            <span>Instant Verification</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                                        <div className="text-center">
                                            <FaQrcode className="text-4xl text-primary mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">Secure QR Code</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white/10">
                    <div className="container">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Why Choose VehicleDoc Pro?</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Experience the future of vehicle document management with our secure, 
                                user-friendly platform designed for everyone.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div 
                                    key={index} 
                                    className={`card-glass text-center transition-all duration-500 ${
                                        index === currentFeature ? 'scale-105 shadow-xl' : ''
                                    }`}
                                >
                                    <div className="mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="card-title text-lg">{feature.title}</h3>
                                    <p className="card-content text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20">
                    <div className="container">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Get started in just a few simple steps
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Register & Upload</h3>
                                <p className="text-gray-600">
                                    Create your account and upload your vehicle documents securely
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Generate QR Code</h3>
                                <p className="text-gray-600">
                                    Get your unique QR code that links to your verified documents
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Instant Verification</h3>
                                <p className="text-gray-600">
                                    Police officers can scan your QR code for immediate document access
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-white/5">
                    <div className="container">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div className="card-glass">
                                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                                <div className="text-gray-600">Documents Verified</div>
                            </div>
                            <div className="card-glass">
                                <div className="text-3xl font-bold text-secondary mb-2">5K+</div>
                                <div className="text-gray-600">Registered Users</div>
                            </div>
                            <div className="card-glass">
                                <div className="text-3xl font-bold text-accent-green mb-2">100%</div>
                                <div className="text-gray-600">Secure & Encrypted</div>
                            </div>
                            <div className="card-glass">
                                <div className="text-3xl font-bold text-accent-orange mb-2">24/7</div>
                                <div className="text-gray-600">Available Access</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="nav-brand flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <FaCar className="text-white text-xl" />
                                </div>
                                <span className="font-bold text-xl text-white">VehicleDoc Pro</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Secure, digital vehicle document management for the modern world.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Features</h4>
                            <div className="space-y-2 text-sm text-gray-400">
                                <p>QR Code Generation</p>
                                <p>Document Encryption</p>
                                <p>Multi-Vehicle Support</p>
                                <p>Police Verification</p>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <div className="space-y-2 text-sm text-gray-400">
                                <p>Help Center</p>
                                <p>Contact Us</p>
                                <p>Privacy Policy</p>
                                <p>Terms of Service</p>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Get Started</h4>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => navigate("/signup")}
                                    className="btn btn-primary w-full"
                                >
                                    Sign Up Now
                                </button>
                                <button 
                                    onClick={() => navigate("/login")}
                                    className="btn btn-outline w-full text-white border-white hover:bg-white hover:text-gray-900"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>© 2025 VehicleDoc Pro. All rights reserved. | Developed by <strong>Narasimha</strong></p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

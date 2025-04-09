"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define proper types for our error state
interface ErrorState {
  email: string;
  username: string;
  password: string;
  general: string | { type: string; message: string } | null;
}

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<ErrorState>({
    email: "",
    username: "",
    password: "",
    general: null,
  });
  
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const basicEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  const validateForm = () => {
    let isValid = true;
    const newErrors: ErrorState = {
      email: "",
      username: "",
      password: "",
      general: null,
    };

    if (!user.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!basicEmailRegex.test(user.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    } else {

      const [localPart, domain] = user.email.split('@');
      const domainParts = domain.split('.');
    
      const isLocalPartOnlyNumbers = /^\d+$/.test(localPart);
      
      const isDomainPartOnlyNumbers = /^\d+$/.test(domainParts[0]);
      
      if (isLocalPartOnlyNumbers && isDomainPartOnlyNumbers) {
        newErrors.email = "Email address cannot have only numbers before and after @";
        isValid = false;
      }

      if (localPart.length < 3) {
        newErrors.email = "Username part of email must be at least 3 characters";
        isValid = false;
      }
      
      const disposableDomains = ['mailinator.com', 'tempmail.com', 'throwawaymail.com', 'yopmail.com', 'guerrillamail.com'];
      if (disposableDomains.some(d => domain.toLowerCase().includes(d))) {
        newErrors.email = "Please use a non-disposable email address";
        isValid = false;
      }
    }

    if (!user.username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (user.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!user.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
    
    if (formSubmitted && errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const onSignup = async () => {
    setFormSubmitted(true);
  
    if (!validateForm()) {
      return;
    }
  
    try {
      setLoading(true);
      setErrors({
        email: "",
        username: "",
        password: "",
        general: null,
      });
  
      const response = await axios.post("/api/users/signup", user);
  
      setErrors((prev) => ({
        ...prev,
        general: { type: "success", message: "OTP sent to your email. Redirecting to verification page..." },
      }));
  
      const redirectUrl = `/verify-otp?userId=${response.data.userId}`;
  
      setTimeout(() => {
        window.location.href = redirectUrl; // Use window.location.href for reliable redirection
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
  
      if (error.response?.data?.field) {
        const field = error.response.data.field as keyof typeof errors;
        setErrors((prev) => ({
          ...prev,
          [field]: errorMessage,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: { type: "error", message: errorMessage },
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email && user.username && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 py-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-black">
          {loading ? "Processing..." : "Signup"}
        </h1>
        
        {errors.general && (
          <div className={`mb-4 p-3 rounded-md ${
            typeof errors.general === 'object' && errors.general.type === "success" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {typeof errors.general === 'object' ? errors.general.message : errors.general}
          </div>
        )}
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 text-black bg-gray-50 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-black">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={user.username}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 text-black bg-gray-50 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 text-black bg-gray-50 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          
          <button
            onClick={onSignup}
            type="button"
            disabled={buttonDisabled || loading}
            className={`w-full py-2 px-4 rounded-lg transition duration-300 ${
              buttonDisabled || loading
                ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
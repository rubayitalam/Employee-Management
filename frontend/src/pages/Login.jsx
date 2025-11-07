import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';

const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                const response = await axios.post(
                    `${VITE_API_URL}/api/auth/login`,
                    {
                        email,
                        password
                    }
                );

                console.log('login.jsx : response', response);

                if (response.data.success) {
                    login(response.data.user);

                    localStorage.setItem('token', response.data.token);

                    if (response.data.user.role === 'admin') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/employee-dashboard');
                    }
                } else {
                    toast.error(response.data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login.jsx : Error during login:', error);
                setErrors({
                    server:
                        error.response?.data?.message ||
                        'Login failed. Please try again.'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800">
                    Employee Management System
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-3xl font-semibold text-center text-gray-700">
                        Login
                    </h2>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            required
                            onChange={e => setEmail(e.target.value)}
                            className={`w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border ${
                                errors.email
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            required
                            onChange={e => setPassword(e.target.value)}
                            className={`w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border ${
                                errors.password
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10`}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute top-2/3 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>

                    {/* Remember Me + Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-600">
                            <input
                                type="checkbox"
                                className="mr-2 rounded border-gray-300 focus:ring-blue-400"
                            />
                            Remember me
                        </label>
                        <a
                            href="#"
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Forgot Password?
                        </a>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                        <span className="mr-1">Don’t have an account?</span>
                        <Link
                            to="/register"
                            className="text-blue-600 font-medium hover:underline hover:text-blue-800 transition-colors duration-200"
                        >
                            Register
                        </Link>
                    </p>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

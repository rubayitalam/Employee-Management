import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${VITE_API_URL}/api/auth/change-password`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('response ok === ', response);
            setSuccess(
                response.data.message || 'Password changed successfully!'
            );
            if (response.status) {
                navigate('/employee-dashboard');
            }
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Failed to change password. Please try again.'
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Change Password
                </h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                {success && (
                    <div className="mb-4 text-green-500">{success}</div>
                )}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Old Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2ec4b6]"
                        placeholder="Change Password"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        New Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2ec4b6]"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-medium">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2ec4b6]"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#2ec4b6] text-white py-2 rounded font-semibold hover:bg-[#279e91] transition"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;

import React from 'react';
import { useAuth } from '../context/authContext';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/dashboard/Navbar';
import AdminSummary from '../components/dashboard/AdminSummary';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/dashboard/EmployeeSidebar';

const AdminDashboard = () => {
    const { user } = useAuth();
    console.log('AdminSIdebr.jsx user == ', user);

    return (
        <div className="flex">
            {user && user?.role === 'admin' ? (
                <AdminSidebar />
            ) : (
                <EmployeeSidebar />
            )}

            <div className="flex-1  bg-gray-100 h-screen">
                <Navbar />
                <Outlet />
                {/* <AdminSummary /> */}
            </div>
        </div>
    );
};

export default AdminDashboard;

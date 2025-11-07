import React, { useEffect, useState } from 'react';
import {
    UsersIcon,
    BuildingOffice2Icon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import SummaryCard from './SummaryCard';
const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';

const AdminSummary = () => {
    const [stats, setStats] = useState({
        employees: { total: 0, byDepartment: [] },
        departments: { total: 0 },
        salary: { total: 0, totalAllowances: 0, totalDeductions: 0, count: 0 },
        leaves: { total: 0, pending: 0, approved: 0, rejected: 0 }
    });

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${VITE_API_URL}/api/auth/admin/dashboard`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const res = await response.json();
            console.log('admin summary res == ', res);
            if (res.success) {
                setStats(res.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const overview = [
        {
            label: 'Total Employees',
            value: stats.employees.total,
            icon: UsersIcon,
            color: 'bg-teal-600',
            card: 'bg-white'
        },
        {
            label: 'Total Departments',
            value: stats.departments.total,
            icon: BuildingOffice2Icon,
            color: 'bg-yellow-500',
            card: 'bg-yellow-100'
        },
        {
            label: 'Total Salary',
            value: `$${stats.salary.total.toLocaleString()}`,
            icon: CurrencyDollarIcon,
            color: 'bg-red-600',
            card: 'bg-white'
        }
    ];

    const leaves = [
        {
            label: 'Leave Applied',
            value: stats.leaves.total,
            icon: DocumentTextIcon,
            color: 'bg-teal-600',
            card: 'bg-white'
        },
        {
            label: 'Leave Approved',
            value: stats.leaves.approved,
            icon: CheckCircleIcon,
            color: 'bg-green-500',
            card: 'bg-green-100'
        },
        {
            label: 'Leave Pending',
            value: stats.leaves.pending,
            icon: ClockIcon,
            color: 'bg-yellow-500',
            card: 'bg-yellow-100'
        },
        {
            label: 'Leave Rejected',
            value: stats.leaves.rejected,
            icon: XCircleIcon,
            color: 'bg-red-600',
            card: 'bg-red-100'
        }
    ];

    return (
        <div className="px-2 py-6 sm:px-4 md:px-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {overview.map(item => (
                    <SummaryCard
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                        color={item.color}
                        card={item.card}
                    />
                ))}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
                Leave Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mx-auto">
                {leaves.map(item => (
                    <SummaryCard
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                        color={item.color}
                        card={item.card}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminSummary;

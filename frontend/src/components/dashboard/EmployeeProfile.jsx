import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';
console.log('Vite = ', VITE_API_URL);

const EmployeeProfile = () => {
    const { user } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?._id) return;
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                console.log('Token == ', token);
                const response = await axios.get(
                    `${VITE_API_URL}/api/employee/${user?._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log('response == ', response);
                setEmployee(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message || 'Failed to load profile.'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    console.log('employee.jsx employee==', employee);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                Loading...
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[80vh] text-red-500">
                {error}
            </div>
        );
    }
    if (!employee) {
        return null;
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Employee Details
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                        <img
                            src={
                                employee.imageUrl ||
                                'https://randomuser.me/api/portraits/men/32.jpg'
                            }
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover border-4 border-[#2ec4b6] mb-4 md:mb-0"
                        />
                    </div>
                    <div>
                        <div className="mb-2">
                            <span className="font-semibold">Name:</span>{' '}
                            {employee.name}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Employee ID:</span>{' '}
                            {employee.empId}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">
                                Date of Birth:
                            </span>{' '}
                            {employee.dob
                                ? new Date(employee.dob).toLocaleDateString()
                                : ''}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Gender:</span>{' '}
                            {employee.gender}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Department:</span>{' '}
                            {employee.department}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">
                                Marital Status:
                            </span>{' '}
                            {employee.maritalStatus}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;

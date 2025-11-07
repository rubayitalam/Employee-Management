import React from 'react';

const ViewEmployee = ({ open, employee, onClose }) => {
    if (!open || !employee) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Employee Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 flex flex-col items-center mb-4">
                        <img
                            src={employee.imageUrl}
                            alt={employee.name}
                            className="w-24 h-24 rounded-full object-cover border"
                        />
                        <span className="mt-2 text-lg font-semibold">
                            {employee.name}
                        </span>
                    </div>
                    <div>
                        <strong>Email:</strong>
                        <div className="text-gray-700">{employee.email}</div>
                    </div>
                    <div>
                        <strong>Employee ID:</strong>
                        <div className="text-gray-700">{employee.empId}</div>
                    </div>
                    <div>
                        <strong>Date of Birth:</strong>
                        <div className="text-gray-700">
                            {employee.dob
                                ? new Date(employee.dob).toLocaleDateString()
                                : '-'}
                        </div>
                    </div>
                    <div>
                        <strong>Gender:</strong>
                        <div className="text-gray-700">{employee.gender}</div>
                    </div>
                    <div>
                        <strong>Marital Status:</strong>
                        <div className="text-gray-700">
                            {employee.maritalStatus}
                        </div>
                    </div>
                    <div>
                        <strong>Department:</strong>
                        <div className="text-gray-700">
                            {employee.department}
                        </div>
                    </div>
                    <div>
                        <strong>Designation:</strong>
                        <div className="text-gray-700">
                            {employee.designation}
                        </div>
                    </div>
                    <div>
                        <strong>Salary:</strong>
                        <div className="text-gray-700">{employee.salary}</div>
                    </div>
                    <div>
                        <strong>Role:</strong>
                        <div className="text-gray-700">{employee.role}</div>
                    </div>
                    <div>
                        <strong>Created At:</strong>
                        <div className="text-gray-700">
                            {employee.createdAt
                                ? new Date(employee.createdAt).toLocaleString()
                                : '-'}
                        </div>
                    </div>
                    <div>
                        <strong>Updated At:</strong>
                        <div className="text-gray-700">
                            {employee.updatedAt
                                ? new Date(employee.updatedAt).toLocaleString()
                                : '-'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEmployee;

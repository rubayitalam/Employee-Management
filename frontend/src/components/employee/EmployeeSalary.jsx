import React, { useState } from 'react';

const mockSalaries = [
    {
        empId: 'yousaf222',
        salary: 1000,
        allowance: 50,
        deduction: 40,
        payDate: '2024-09-11'
    }
    // Add more mock data if needed
];

const EmployeeSalary = () => {
    const [search, setSearch] = useState('');

    const filteredSalaries = mockSalaries.filter(salary =>
        salary.empId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Salary History
                </h2>
                <div className="flex justify-end mb-4">
                    <input
                        type="text"
                        placeholder="Search By Emp ID"
                        className="border px-3 py-2 rounded"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="px-2 py-2">SNO</th>
                            <th className="px-2 py-2">EMP ID</th>
                            <th className="px-2 py-2">SALARY</th>
                            <th className="px-2 py-2">ALLOWANCE</th>
                            <th className="px-2 py-2">DEDUCTION</th>
                            <th className="px-2 py-2">TOTAL</th>
                            <th className="px-2 py-2">PAY DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSalaries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    No salary records found.
                                </td>
                            </tr>
                        ) : (
                            filteredSalaries.map((salary, idx) => (
                                <tr key={salary.empId} className="border-b">
                                    <td className="px-2 py-2">{idx + 1}</td>
                                    <td className="px-2 py-2">
                                        {salary.empId}
                                    </td>
                                    <td className="px-2 py-2">
                                        {salary.salary}
                                    </td>
                                    <td className="px-2 py-2">
                                        {salary.allowance}
                                    </td>
                                    <td className="px-2 py-2">
                                        {salary.deduction}
                                    </td>
                                    <td className="px-2 py-2">
                                        {salary.salary +
                                            salary.allowance -
                                            salary.deduction}
                                    </td>
                                    <td className="px-2 py-2">
                                        {new Date(
                                            salary.payDate
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeSalary;

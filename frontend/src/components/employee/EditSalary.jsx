import React, { useState, useEffect } from 'react';

const EditSalary = ({
    open,
    onClose,
    onSave,
    departments = [],
    employees = [],
    initialData = {}
}) => {
    const [form, setForm] = useState({
        department: '',
        employee: '',
        basicSalary: '',
        allowances: '',
        deductions: '',
        payDate: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData && open) {
            setForm({
                department: initialData.department || '',
                employee: initialData.employee || '',
                basicSalary: initialData.basicSalary || '',
                allowances: initialData.allowances || '',
                deductions: initialData.deductions || '',
                payDate: initialData.payDate
                    ? initialData.payDate.slice(0, 10)
                    : ''
            });
        } else if (open) {
            setForm({
                department: '',
                employee: '',
                basicSalary: '',
                allowances: '',
                deductions: '',
                payDate: ''
            });
        }
        setError('');
    }, [initialData, open]);

    if (!open) return null;

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (
            !form.department ||
            !form.employee ||
            !form.basicSalary ||
            !form.payDate
        ) {
            setError(
                'Department, Employee, Basic Salary, and Pay Date are required'
            );
            return;
        }
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Add New Salary
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
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Department
                        </label>
                        <select
                            name="department"
                            className="w-full px-4 py-2 border rounded"
                            value={form.department}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            {departments.map(dep => (
                                <option key={dep._id} value={dep.name}>
                                    {dep.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Employee
                        </label>
                        <select
                            name="employee"
                            className="w-full px-4 py-2 border rounded"
                            value={form.employee}
                            onChange={handleChange}
                        >
                            <option value="">Select Employee</option>
                            {employees
                                .filter(
                                    emp =>
                                        !form.department ||
                                        emp.department === form.department
                                )
                                .map(emp => (
                                    <option key={emp._id} value={emp._id}>
                                        {emp.name} ({emp.empId})
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Basic Salary
                        </label>
                        <input
                            name="basicSalary"
                            type="number"
                            placeholder="Insert Salary"
                            className="w-full px-4 py-2 border rounded"
                            value={form.basicSalary}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Allowances
                        </label>
                        <input
                            name="allowances"
                            type="number"
                            placeholder="Monthly Allowances"
                            className="w-full px-4 py-2 border rounded"
                            value={form.allowances}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Deductions
                        </label>
                        <input
                            name="deductions"
                            type="number"
                            placeholder="Monthly Deductions"
                            className="w-full px-4 py-2 border rounded"
                            value={form.deductions}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Pay Date
                        </label>
                        <input
                            name="payDate"
                            type="date"
                            className="w-full px-4 py-2 border rounded"
                            value={form.payDate}
                            onChange={handleChange}
                        />
                    </div>
                    {error && (
                        <div className="md:col-span-2 text-red-500 text-xs mb-2">
                            {error}
                        </div>
                    )}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Add Salary
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSalary;

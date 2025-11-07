import React, { useState } from 'react';
const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';
const AddDepartment = ({ open, onAdd, onClose }) => {
    const [depName, setDepName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    if (!open) return null;

    const handleSubmit = e => {
        e.preventDefault();
        if (!depName.trim()) {
            setError('Department name is required');
            return;
        }
        onAdd({ name: depName.trim(), description: description.trim() });
        setDepName('');
        setDescription('');
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-96 max-w-full transform transition-all">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Add New Department
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="dept_name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Department Name
                        </label>
                        <input
                            type="text"
                            id="dept_name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            placeholder="Enter department name"
                            value={depName}
                            onChange={e => {
                                setDepName(e.target.value);
                                setError('');
                            }}
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows="3"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                            placeholder="Enter department description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                            onClick={() => {
                                setDepName('');
                                setDescription('');
                                setError('');
                                onClose();
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
                        >
                            Add Department
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDepartment;

import React, { useState, useEffect } from 'react';
import AddDepartment from './AddDepartment';
const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDepartments, setTotalDepartments] = useState(0);
    const departmentsPerPage = 10;

    // Fetch departments on component mount and page change
    useEffect(() => {
        fetchDepartments();
    }, [currentPage]);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${VITE_API_URL}/api/department?page=${currentPage}&limit=${departmentsPerPage}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (!response.ok) throw new Error('Failed to fetch departments');
            const data = await response.json();

            setDepartments(data.departments);
            setTotalPages(data.totalPages);
            setTotalDepartments(data.totalDepartments);
        } catch (err) {
            setError('Failed to load departments');
            console.error('Error fetching departments:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDepartments = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = async departmentData => {
        try {
            setLoading(true);
            const response = await fetch(`${VITE_API_URL}/api/department/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(departmentData)
            });

            if (!response.ok) throw new Error('Failed to add department');

            const newDepartment = await response.json();
            // Refresh the current page after adding
            fetchDepartments();
            setShowDialog(false);
        } catch (err) {
            setError('Failed to add department');
            console.error('Error adding department:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async id => {
        if (!id) {
            setError('Invalid department ID');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${VITE_API_URL}/api/department/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ name: editValue })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to update department'
                );
            }

            const updatedDepartment = await response.json();
            setDepartments(
                departments.map(d => (d._id === id ? updatedDepartment : d))
            );
            setEditId(null);
            setEditValue('');
        } catch (err) {
            setError(err.message || 'Failed to update department');
            console.error('Error updating department:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async id => {
        if (!id) {
            setError('Invalid department ID');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${VITE_API_URL}/api/department/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to delete department'
                );
            }

            // If we're on the last page and it's the last item, go to previous page
            if (departments.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                fetchDepartments();
            }
        } catch (err) {
            setError(err.message || 'Failed to delete department');
            console.error('Error deleting department:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = newPage => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="p-4 sm:p-8 min-h-screen">
            <div className="max-w-9xl mx-auto bg-white sm:p-8">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <input
                        type="text"
                        placeholder="Search By Department"
                        className="border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button
                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded transition-colors w-full sm:w-auto disabled:opacity-50"
                        onClick={() => setShowDialog(true)}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Add New Department'}
                    </button>
                </div>

                <div className="overflow-x-auto  rounded-md border border-gray-200">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold">
                                    S No
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Department
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Description
                                </th>
                                <th className="py-3 px-4  font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.map((dept, idx) => (
                                <tr
                                    key={dept._id}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <td className="py-3 px-4">
                                        {(currentPage - 1) *
                                            departmentsPerPage +
                                            idx +
                                            1}
                                    </td>
                                    <td className="py-3 px-4">
                                        {editId === dept._id ? (
                                            <input
                                                className="border rounded px-2 py-1 w-36 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                value={editValue}
                                                onChange={e =>
                                                    setEditValue(e.target.value)
                                                }
                                                autoFocus
                                            />
                                        ) : (
                                            dept.name
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {dept.description || '-'}
                                    </td>
                                    <td className="py-3  justify-center  px-4 flex flex-wrap gap-2">
                                        {editId === dept._id ? (
                                            <>
                                                <button
                                                    className="bg-teal-600 hover:bg-teal-700 text-white w-[60px] text-center py-1.5 rounded transition"
                                                    onClick={() =>
                                                        handleEdit(dept._id)
                                                    }
                                                    disabled={loading}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="bg-gray-400 hover:bg-gray-500 text-white w-[60px] text-center py-1.5 rounded transition"
                                                    onClick={() =>
                                                        setEditId(null)
                                                    }
                                                    disabled={loading}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 w-[60px] text-center text-white  py-1.5 rounded transition"
                                                    onClick={() => {
                                                        setEditId(dept._id);
                                                        setEditValue(dept.name);
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 w-[60px] text-center hover:bg-red-600 text-white  py-1.5 rounded transition"
                                                    onClick={() =>
                                                        handleDelete(dept._id)
                                                    }
                                                    disabled={loading}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredDepartments.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        {loading
                                            ? 'Loading...'
                                            : 'No departments found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 text-xs text-gray-600 gap-2">
                    <div>
                        Rows per page:{' '}
                        <span className="font-semibold">
                            {departmentsPerPage}
                        </span>
                    </div>
                    <div>
                        {(currentPage - 1) * departmentsPerPage + 1}-
                        {Math.min(
                            currentPage * departmentsPerPage,
                            totalDepartments
                        )}{' '}
                        of {totalDepartments}
                    </div>
                    <div className="flex items-center gap-3 justify-center mt-4">
                        <button
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={loading || currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="text-sm text-gray-600">
                            Page <strong>{currentPage}</strong> of{' '}
                            <strong>{totalPages}</strong>
                        </span>
                        <button
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={loading || currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <AddDepartment
                open={showDialog}
                onAdd={handleAdd}
                onClose={() => setShowDialog(false)}
            />
        </div>
    );
};

export default DepartmentList;

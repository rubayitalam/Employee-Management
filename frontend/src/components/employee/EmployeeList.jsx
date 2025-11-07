import React, { useState, useEffect } from 'react';
import AddEmployee from './AddEmployee';
import ViewEmployee from './ViewEmployee';
import EditEmployee from './EditEmployee';
import EditSalary from './EditSalary';
const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const employeesPerPage = 10;
    const [viewEmployee, setViewEmployee] = useState(null);
    const [editEmployee, setEditEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [showSalaryModal, setShowSalaryModal] = useState(false);
    const [salaryInitialData, setSalaryInitialData] = useState({});
    const [salaryEditId, setSalaryEditId] = useState(null);

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
        fetchSalaries();
    }, [currentPage]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const response = await fetch(
                `${VITE_API_URL}/api/employee?page=${currentPage}&limit=${employeesPerPage}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log('EmployeeList.jsx response === ', response);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to fetch employees'
                );
            }
            const data = await response.json();
            console.log('EmployeeList.jsx data === ', data);
            setEmployees(data.employees);
            setTotalPages(data.totalPages);
            setTotalEmployees(data.totalEmployees);
        } catch (err) {
            setErrorMessage(err.message || 'Failed to load employees');
            console.error('Failed to fetch employees:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            setErrorMessage('');
            const res = await fetch(`${VITE_API_URL}/api/department`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData.message || 'Failed to fetch departments'
                );
            }
            const data = await res.json();
            setDepartments(data.departments || data);
        } catch (err) {
            setErrorMessage(err.message || 'Failed to load departments');
            console.error('Failed to fetch departments:', err);
        }
    };

    const fetchSalaries = async () => {
        try {
            setErrorMessage('');
            console.log('Fetching salaries...');

            const response = await fetch(
                `${VITE_API_URL}/api/employee/salary`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('Salary response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Salary fetch error details:', errorData);
                throw new Error(
                    errorData.message ||
                        `Failed to fetch salaries: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            console.log('Salaries data received:', data);

            if (!Array.isArray(data)) {
                console.error('Invalid salary data format:', data);
                throw new Error(
                    'Invalid salary data format received from server'
                );
            }

            setSalaries(data);
        } catch (err) {
            const errorMsg = err.message || 'Failed to load salaries';
            setErrorMessage(errorMsg);
            console.error('Salary fetch error:', {
                message: err.message,
                error: err
            });
        }
    };

    const handleAdd = async employeeData => {
        console.log('employeeList.jsx empoyeeData === ', employeeData);
        try {
            setLoading(true);
            setErrorMessage('');

            // Handle image upload if there's an image
            let finalData = { ...employeeData };
            if (employeeData.imageUrl) {
                const data = new FormData();
                data.append('file', employeeData.imageUrl);
                data.append(
                    'upload_preset',
                    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
                );
                data.append(
                    'cloud_name',
                    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                );

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${
                        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                    }/image/upload`,
                    {
                        method: 'POST',
                        body: data
                    }
                );

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Failed to upload image'
                    );
                }

                const cloudinaryData = await res.json();
                console.log(
                    'employeeList.jsx cloudinaryData === ',
                    cloudinaryData
                );
                if (!cloudinaryData.secure_url) {
                    throw new Error('Failed to get image URL from Cloudinary');
                }
                finalData.imageUrl = cloudinaryData.secure_url;
                delete finalData.image;
            }

            // Convert data to match backend expectations
            if (finalData.gender)
                finalData.gender = finalData.gender.toLowerCase();
            if (finalData.maritalStatus)
                finalData.maritalStatus = finalData.maritalStatus.toLowerCase();
            if (finalData.role) finalData.role = finalData.role.toLowerCase();
            if (finalData.salary) finalData.salary = Number(finalData.salary);

            const response = await fetch(`${VITE_API_URL}/api/employee/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(finalData)
            });

            console.log('EmpoyeeList.jsx response === ', response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add employee');
            }

            await fetchEmployees();
            setShowDialog(false);
        } catch (err) {
            setErrorMessage(err.message || 'Failed to add employee');
            console.error('Failed to add employee:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async id => {
        try {
            setLoading(true);
            setErrorMessage('');
            const response = await fetch(`${VITE_API_URL}/api/employee/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to delete employee'
                );
            }
            await fetchEmployees();
        } catch (err) {
            setErrorMessage(err.message || 'Failed to delete employee');
            console.error('Failed to delete employee:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = newPage => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleView = async id => {
        try {
            const response = await fetch(`${VITE_API_URL}/api/employee/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch employee');
            const data = await response.json();
            setViewEmployee(data);
        } catch (err) {
            console.log('handle view is not performed : ', err);
            setErrorMessage('Failed to view employee');
        }
    };

    const handleEdit = async id => {
        try {
            const response = await fetch(`${VITE_API_URL}/api/employee/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch employee');
            const data = await response.json();
            setEditEmployee(data);
        } catch (err) {
            console.log('handleEdit error is occurred : ', err);
            setErrorMessage('failed to edit employee');
        }
    };

    const handleSaveEdit = async updatedData => {
        try {
            setLoading(true);
            setErrorMessage('');

            // Handle image upload if there's a new image
            let finalData = { ...updatedData };
            if (updatedData.image) {
                const data = new FormData();
                data.append('file', updatedData.image);
                data.append(
                    'upload_preset',
                    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
                );
                data.append(
                    'cloud_name',
                    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                );

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${
                        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                    }/image/upload`,
                    {
                        method: 'POST',
                        body: data
                    }
                );

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Failed to upload image'
                    );
                }

                const cloudinaryData = await res.json();
                if (!cloudinaryData.secure_url) {
                    throw new Error('Failed to get image URL from Cloudinary');
                }
                finalData.imageUrl = cloudinaryData.secure_url;
                delete finalData.image;
            }

            // Convert data to match backend expectations
            if (finalData.gender)
                finalData.gender = finalData.gender.toLowerCase();
            if (finalData.maritalStatus)
                finalData.maritalStatus = finalData.maritalStatus.toLowerCase();
            if (finalData.role) finalData.role = finalData.role.toLowerCase();
            if (finalData.salary) finalData.salary = Number(finalData.salary);

            const response = await fetch(
                `${VITE_API_URL}/api/employee/${editEmployee._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(finalData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to update employee'
                );
            }

            setEditEmployee(null);
            await fetchEmployees();
        } catch (err) {
            setErrorMessage(err.message || 'Failed to update employee');
            console.error('Failed to update employee:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSalary = async form => {
        try {
            setLoading(true);
            setErrorMessage('');
            let url = `${VITE_API_URL}/api/employee/salary/add`;
            let method = 'POST';
            if (salaryEditId) {
                url = `${VITE_API_URL}/api/employee/salary/${salaryEditId}`;
                method = 'PUT';
            }
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(form)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save salary');
            }
            setShowSalaryModal(false);
            setSalaryEditId(null);
            await fetchSalaries();
        } catch (err) {
            setErrorMessage(err.message || 'Failed to save salary');
            console.error('Failed to save salary:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSalary = employee => {
        setSalaryEditId(null);
        setSalaryInitialData({
            department: employee.department,
            employee: employee._id
        });
        setShowSalaryModal(true);
    };

    const handleEditSalary = async salaryId => {
        try {
            const response = await fetch(
                `${VITE_API_URL}/api/employee/salary/${salaryId}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (!response.ok) throw new Error('Failed to fetch salary');
            const data = await response.json();
            setSalaryEditId(data._id);
            setSalaryInitialData({
                department: data.department,
                employee: data.employee._id,
                basicSalary: data.basicSalary,
                allowances: data.allowances,
                deductions: data.deductions,
                payDate: data.payDate ? data.payDate.slice(0, 10) : ''
            });
            setShowSalaryModal(true);
        } catch (err) {
            setErrorMessage('Failed to fetch salary');
            console.log('failed to fetch salary error : ', err);
        }
    };

    const handleDeleteSalary = async id => {
        try {
            setLoading(true);
            const response = await fetch(
                `${VITE_API_URL}/api/employee/salary/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (!response.ok) throw new Error('Failed to delete salary');
            fetchSalaries();
        } catch (err) {
            setErrorMessage('Failed to delete salary');
            console.log('failed to delete salary error : ', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.empId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
            {errorMessage && (
                <div className="max-w-5xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                </div>
            )}
            <div className="max-w-9xl mx-auto bg-white  sm:p-8 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <input
                        type="text"
                        placeholder="Search By Employee ID"
                        className="border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button
                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded transition-colors w-full sm:w-auto"
                        onClick={() => setShowDialog(true)}
                        disabled={loading}
                    >
                        Add New Employee
                    </button>
                </div>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold">
                                    S No
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Image
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Name
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    DOB
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Department
                                </th>
                                <th className="py-3 px-4 font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp, idx) => (
                                <tr
                                    key={emp._id}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <td className="py-3 px-4">
                                        {(currentPage - 1) * employeesPerPage +
                                            idx +
                                            1}
                                    </td>
                                    <td className="py-3 px-4">
                                        <img
                                            src={emp.imageUrl}
                                            alt={emp.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="py-3 px-4">{emp.name}</td>
                                    <td className="py-3 px-4">
                                        {emp.dob
                                            ? new Date(
                                                  emp.dob
                                              ).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {emp.department || '-'}
                                    </td>
                                    <td className="py-3 justify-center px-4 flex flex-wrap gap-2">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white w-[60px] text-center py-1.5 rounded transition"
                                            onClick={() => handleView(emp._id)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white w-[60px] text-center py-1.5 rounded transition"
                                            onClick={() => handleEdit(emp._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleSalary(emp?._id)
                                            }
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white w-[60px] text-center py-1.5 rounded transition"
                                        >
                                            Salary
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white w-[60px] text-center py-1.5 rounded transition"
                                            onClick={() =>
                                                handleDelete(emp._id)
                                            }
                                            disabled={loading}
                                        >
                                            Leave
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        {loading
                                            ? 'Loading...'
                                            : 'No employees found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center gap-3 justify-center mt-4 text-xs text-gray-600">
                    <div>
                        Rows per page:{' '}
                        <span className="font-semibold">
                            {employeesPerPage}
                        </span>
                    </div>
                    <div>
                        {(currentPage - 1) * employeesPerPage + 1}-
                        {Math.min(
                            currentPage * employeesPerPage,
                            totalEmployees
                        )}{' '}
                        of {totalEmployees}
                    </div>
                    <div className="flex items-center gap-3">
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
            <AddEmployee
                open={showDialog}
                onAdd={handleAdd}
                onClose={() => setShowDialog(false)}
                departments={departments}
            />
            <ViewEmployee
                open={!!viewEmployee}
                employee={viewEmployee}
                onClose={() => setViewEmployee(null)}
            />
            <EditEmployee
                open={!!editEmployee}
                employee={editEmployee}
                onSave={handleSaveEdit}
                onClose={() => setEditEmployee(null)}
                departments={departments}
            />
            <EditSalary
                open={showSalaryModal}
                onClose={() => {
                    setShowSalaryModal(false);
                    setSalaryEditId(null);
                }}
                onSave={handleSaveSalary}
                departments={departments}
                employees={employees}
                initialData={salaryInitialData}
            />

            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Salaries</h2>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <tr className="text-left">
                                <th className="py-3 px-4">Department</th>
                                <th className="py-3 px-4">Employee</th>
                                <th className="py-3 px-4">Basic Salary</th>
                                <th className="py-3 px-4">Allowances</th>
                                <th className="py-3 px-4">Deductions</th>
                                <th className="py-3 px-4">Pay Date</th>
                                <th className="py-3  px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaries.map(sal => (
                                <tr
                                    key={sal._id}
                                    className="border-b  border-gray-200"
                                >
                                    <td className="py-3 px-4">
                                        {sal.department}
                                    </td>
                                    <td className="py-3 px-4">
                                        {sal.employee?.name} (
                                        {sal.employee?.empId})
                                    </td>
                                    <td className="py-3 px-4">
                                        {sal.basicSalary}
                                    </td>
                                    <td className="py-3 px-4">
                                        {sal.allowances}
                                    </td>
                                    <td className="py-3 px-4">
                                        {sal.deductions}
                                    </td>
                                    <td className="py-3 px-4">
                                        {sal.payDate
                                            ? new Date(
                                                  sal.payDate
                                              ).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="py-3  px-4 flex gap-2">
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white w-[60px] text-center py-1 rounded"
                                            onClick={() =>
                                                handleEditSalary(sal._id)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white w-[60px] text-center py-1 rounded"
                                            onClick={() =>
                                                handleDeleteSalary(sal._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {salaries.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        No salaries found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;

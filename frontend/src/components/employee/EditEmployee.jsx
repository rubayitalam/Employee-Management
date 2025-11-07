import React, { useState, useEffect } from 'react';

const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL_STATUSES = ['Single', 'Married'];
const ROLES = ['Admin', 'Manager', 'Employee'];

const EditEmployee = ({
    open,
    employee,
    onSave,
    onClose,
    departments = []
}) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        empId: '',
        dob: '',
        gender: '',
        maritalStatus: '',
        department: '',
        designation: '',
        salary: '',
        role: '',
        password: '',
        image: null,
        imageUrl: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (employee) {
            setForm({
                name: employee.name || '',
                email: employee.email || '',
                empId: employee.empId || '',
                dob: employee.dob ? employee.dob.slice(0, 10) : '',
                gender: employee.gender || '',
                maritalStatus: employee.maritalStatus || '',
                department: employee.department || '',
                designation: employee.designation || '',
                salary: employee.salary || '',
                role: employee.role || '',
                password: '',
                image: null,
                imageUrl: employee.imageUrl || ''
            });
        }
    }, [employee]);

    if (!open || !employee) return null;

    const handleChange = e => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setForm({ ...form, image: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        // Basic validation
        for (const key of [
            'name',
            'email',
            'empId',
            'dob',
            'gender',
            'maritalStatus',
            'department',
            'designation',
            'salary',
            'role'
        ]) {
            if (!form[key]) {
                setError('All fields except password and image are required');
                return;
            }
        }

        let imageUrl = form.imageUrl;
        if (form.image) {
            // Upload to Cloudinary
            const data = new FormData();
            data.append('file', form.image);
            data.append(
                'upload_preset',
                import.meta.env.CLOUDINARY_UPLOAD_PRESET
            );
            data.append('cloud_name', import.meta.env.CLOUDINARY_CLOUD_NAME);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${
                    import.meta.env.CLOUDINARY_CLOUD_NAME
                }/image/upload`,
                {
                    method: 'POST',
                    body: data
                }
            );
            const cloudinaryData = await res.json();
            imageUrl = cloudinaryData.secure_url;
        }

        // Prepare data for backend
        const updatedData = { ...form, imageUrl };
        delete updatedData.image;

        onSave(updatedData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Edit Employee
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
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            className="w-full px-4 py-2 border rounded"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            className="w-full px-4 py-2 border rounded"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Employee ID
                        </label>
                        <input
                            name="empId"
                            type="text"
                            className="w-full px-4 py-2 border rounded"
                            value={form.empId}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            name="dob"
                            type="date"
                            className="w-full px-4 py-2 border rounded"
                            value={form.dob}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            name="gender"
                            className="w-full px-4 py-2 border rounded"
                            value={form.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            {GENDERS.map(g => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Marital Status
                        </label>
                        <select
                            name="maritalStatus"
                            className="w-full px-4 py-2 border rounded"
                            value={form.maritalStatus}
                            onChange={handleChange}
                        >
                            <option value="">Select Status</option>
                            {MARITAL_STATUSES.map(s => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
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
                            Designation
                        </label>
                        <input
                            name="designation"
                            type="text"
                            className="w-full px-4 py-2 border rounded"
                            value={form.designation}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Salary
                        </label>
                        <input
                            name="salary"
                            type="number"
                            className="w-full px-4 py-2 border rounded"
                            value={form.salary}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            className="w-full px-4 py-2 border rounded"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            name="role"
                            className="w-full px-4 py-2 border rounded"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="">Select Role</option>
                            {ROLES.map(r => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Image
                        </label>
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            className="w-full"
                            onChange={handleChange}
                        />
                        {form.imageUrl && (
                            <img
                                src={form.imageUrl}
                                alt="Current"
                                className="mt-2 w-20 h-20 object-cover rounded"
                            />
                        )}
                    </div>
                    {error && (
                        <div className="md:col-span-2 text-red-500 text-xs mb-2">
                            {error}
                        </div>
                    )}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployee;

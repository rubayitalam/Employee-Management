import React, { useEffect, useState } from 'react';
import axios from 'axios';

const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';

const EmployeeLeave = () => {
    const [leaves, setLeaves] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        leaveType: '',
        from: '',
        to: '',
        description: ''
    });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchLeaves = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('token == ', token);
        const res = await axios.get(`${VITE_API_URL}/api/employee/leave`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('res == ', res);
        setLeaves(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    console.log('form == ', form);

    const handleSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await axios.post(
            `${VITE_API_URL}/api/employee/leave`,
            form,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log('res === ', res);
        setShowForm(false);
        setForm({ leaveType: '', from: '', to: '', description: '' });
        fetchLeaves();
    };

    const filteredLeaves = leaves.filter(l =>
        l.status.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-gray-100 min-h-screen sm:p-8">
            <div className="max-w-9xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Manage Leaves
                </h2>
                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search By Status"
                        className="border px-3 py-2 rounded"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button
                        className="bg-[#2ec4b6] text-white px-6 py-2 rounded font-semibold hover:bg-[#279e91] transition"
                        onClick={() => setShowForm(true)}
                    >
                        Add Leave
                    </button>
                </div>
                {showForm && (
                    <form className="mb-6" onSubmit={handleSubmit}>
                        <div className="flex gap-4 mb-2">
                            <select
                                name="leaveType"
                                value={form.leaveType}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-1/3"
                                required
                            >
                                <option value="">Select Leave Type</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="Casual Leave">
                                    Casual Leave
                                </option>
                                <option value="Earned Leave">
                                    Earned Leave
                                </option>
                            </select>
                            <input
                                type="date"
                                name="from"
                                value={form.from}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-1/3"
                                required
                            />
                            <input
                                type="date"
                                name="to"
                                value={form.to}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-1/3"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="border px-3 py-2 rounded w-full mb-2"
                            required
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-[#2ec4b6] text-white px-4 py-2 rounded font-semibold hover:bg-[#279e91] transition"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="px-2 py-2">SNO</th>
                            <th className="px-2 py-2">LEAVE TYPE</th>
                            <th className="px-2 py-2">FROM</th>
                            <th className="px-2 py-2">TO</th>
                            <th className="px-2 py-2">DESCRIPTION</th>
                            <th className="px-2 py-2">APPLIED DATE</th>
                            <th className="px-2 py-2">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredLeaves.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    No leaves found.
                                </td>
                            </tr>
                        ) : (
                            filteredLeaves.map((leave, idx) => (
                                <tr key={leave._id} className="border-b">
                                    <td className="px-2 py-2">{idx + 1}</td>
                                    <td className="px-2 py-2">
                                        {leave.leaveType}
                                    </td>
                                    <td className="px-2 py-2">
                                        {new Date(
                                            leave.from
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-2 py-2">
                                        {new Date(
                                            leave.to
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-2 py-2">
                                        {leave.description}
                                    </td>
                                    <td className="px-2 py-2">
                                        {new Date(
                                            leave.appliedDate
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-2 py-2">
                                        <span
                                            className={`
      px-3 py-1 rounded-full text-sm font-medium
      ${leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
      ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' : ''}
      ${leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
    `}
                                        >
                                            {leave.status}
                                        </span>
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

export default EmployeeLeave;

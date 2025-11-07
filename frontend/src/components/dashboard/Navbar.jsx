import { useAuth } from './../../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${VITE_API_URL}/api/auth/logout`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="bg-[#2ec4b6] text-white p-4 pl-20 flex justify-between items-center shadow-md">
            <p className="text-xl font-semibold">Welcome, {user?.name}</p>
            <button
                className="bg-white text-[#2ec4b6] px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;

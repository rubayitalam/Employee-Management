import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeList from './components/employee/EmployeeList';

import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import AdminSummary from './components/dashboard/AdminSummary';
import DepartmentList from './components/department/DepartmentList';
import AddDepartment from './components/department/AddDepartment';

import EmployeeProfile from './components/dashboard/EmployeeProfile';
import ChangePassword from './components/dashboard/ChangePassword';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeLeave from './components/employee/EmployeeLeave';
import EmployeeSalary from './components/employee/EmployeeSalary';
import Register from './pages/Register';
import Home from './pages/Home';
import { useAuth } from './context/authContext';

function App() {
    const { user } = useAuth();

    console.log('use in app.jsx = ', user);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* this code is original==============  */}
                    {user ? (
                        user?.role === 'admin' ? (
                            <Route
                                path="/"
                                element={<Navigate to="/admin-dashboard" />}
                            />
                        ) : (
                            <Route
                                path="/"
                                element={<Navigate to="/employee-dashboard" />}
                            />
                        )
                    ) : (
                        <Route path="/" element={<Home />} />
                    )}

                    {/* this code is just testing purpose start ==============  */}

                    {/* <Route
                        path="/"
                        element={<Navigate to="/admin-dashboard" />}
                    />

                    <Route
                        path="/"
                        element={<Navigate to="/employee-dashboard" />}
                    />

                    <Route path="/" element={<Home />} /> */}

                    {/* this code is just testing purpose end ==============  */}

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/admin-dashboard"
                        element={
                            <PrivateRoutes>
                                <RoleBaseRoutes requiredRole={['admin']}>
                                    <AdminDashboard />
                                </RoleBaseRoutes>
                            </PrivateRoutes>
                        }
                    >
                        <Route index element={<AdminSummary />} />
                        <Route
                            path="/admin-dashboard/departments"
                            element={<DepartmentList />}
                        />
                        <Route
                            path="/admin-dashboard/add-department"
                            element={<AddDepartment />}
                        />
                        <Route
                            path="/admin-dashboard/employees"
                            element={<EmployeeList />}
                        />
                        <Route
                            path="/admin-dashboard/leave"
                            element={<EmployeeLeave />}
                        />
                        <Route
                            path="/admin-dashboard/salary"
                            element={<EmployeeSalary />}
                        />
                        <Route
                            path="/admin-dashboard/setting"
                            element={<ChangePassword />}
                        />
                    </Route>
                    <Route
                        path="/employee-dashboard"
                        element={
                            <PrivateRoutes>
                                <RoleBaseRoutes requiredRole={['employee']}>
                                    <EmployeeDashboard />
                                </RoleBaseRoutes>
                            </PrivateRoutes>
                        }
                    >
                        <Route index element={<EmployeeList />} />
                        <Route path="profile" element={<EmployeeProfile />} />
                        <Route path="setting" element={<ChangePassword />} />
                        <Route path="leave" element={<EmployeeLeave />} />
                        <Route path="salary" element={<EmployeeSalary />} />
                        <Route
                            path="/employee-dashboard/employees"
                            element={<EmployeeList />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </>
    );
}

export default App;

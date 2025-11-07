import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    UsersIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const navItems = [
    {
        name: 'Dashboard',
        href: '/admin-dashboard',
        icon: HomeIcon,
        active: true
    },
    { name: 'Employees', href: '/admin-dashboard/employees', icon: UsersIcon },
    {
        name: 'Departments',
        href: '/admin-dashboard/departments',
        icon: BuildingOffice2Icon
    },
    {
        name: 'Leaves',
        href: '/admin-dashboard/leave',
        icon: CalendarDaysIcon
    },
    {
        name: 'Salary',
        href: '/admin-dashboard/salary',
        icon: CurrencyDollarIcon
    },
    {
        name: 'Setting',
        href: '/admin-dashboard/setting',
        icon: Cog6ToothIcon
    }
];

const AdminSidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden  justify-between fixed items-center px-4 py-4 ">
                {/* <div className="text-xl font-bold font-cursive tracking-wide">
                    Employee MS
                </div> */}
                <button className="" onClick={() => setOpen(!open)}>
                    {open ? (
                        <XMarkIcon className="h-9 w-9" />
                    ) : (
                        <Bars3Icon className="h-9 w-9 font-bold text-3xl" />
                    )}
                </button>
            </div>
            {/* Sidebar for desktop, drawer for mobile */}
            <div>
                {/* Overlay for mobile drawer */}
                {open && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                        onClick={() => setOpen(false)}
                    />
                )}
                <div
                    className={`fixed z-40 md:static top-0 left-0 h-full w-64 bg-[#23293b] text-white flex flex-col transform transition-transform duration-200 md:translate-x-0 ${
                        open
                            ? 'translate-x-0'
                            : '-translate-x-full md:translate-x-0'
                    }`}
                >
                    <div className="bg-[#2ec4b6] py-5 text-center text-2xl font-cursive font-bold tracking-wide md:block hidden">
                        Employee MS
                    </div>
                    <nav className="flex-1 mt-4">
                        {navItems.map(item => (
                            <NavLink
                                to={item.href}
                                key={item.name}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-6 py-3 cursor-pointer text-base font-medium transition-colors ${
                                        isActive
                                            ? 'bg-[#2ec4b6] text-white rounded-md'
                                            : 'hover:bg-[#2ec4b6]/80 hover:text-white'
                                    }`
                                }
                                end
                                onClick={() => setOpen(false)}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;

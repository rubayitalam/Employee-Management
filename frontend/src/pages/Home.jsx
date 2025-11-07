import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    UsersIcon,
    BuildingOffice2Icon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

import SummaryCard from './../components/dashboard/SummaryCard';

const images = [
    '/carousal1.webp',
    '/carousal2.png',
    '/carousal3.png',
    '/carousal4.png',
    '/carousal5.png'
];

const overview = [
    {
        label: 'Total Employees',
        value: 5,
        icon: UsersIcon,
        color: 'bg-teal-600',
        card: 'bg-white'
    },
    {
        label: 'Total Departments',
        value: 3,
        icon: BuildingOffice2Icon,
        color: 'bg-yellow-500',
        card: 'bg-yellow-100'
    },
    {
        label: 'Monthly Pay',
        value: '$2500',
        icon: CurrencyDollarIcon,
        color: 'bg-red-600',
        card: 'bg-white'
    }
];

const leaves = [
    {
        label: 'Leave Applied',
        value: 2,
        icon: DocumentTextIcon,
        color: 'bg-teal-600',
        card: 'bg-white'
    },
    {
        label: 'Leave Approved',
        value: 2,
        icon: CheckCircleIcon,
        color: 'bg-green-500',
        card: 'bg-green-100'
    },
    {
        label: 'Leave Pending',
        value: 1,
        icon: ClockIcon,
        color: 'bg-yellow-500',
        card: 'bg-yellow-100'
    },
    {
        label: 'Leave Rejected',
        value: 2,
        icon: XCircleIcon,
        color: 'bg-red-600',
        card: 'bg-red-100'
    }
];

const Home = () => {
    const [current, setCurrent] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 3000);

        // Trigger animation after component mounts
        setIsVisible(true);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section with Carousel */}

            {/* marque tag scroll from right to left  */}
            {/* <marqspuee
                direction="left"
                className="absolute top-0 w-full z-50 bg-black text-white text-lg font-medium py-2"
            >
                Admin email : mijan.cse19@gamil.com, password : 12345678
            </marqspuee> */}
            <span className="absolute top-0 w-full z-50 bg-black text-center text-white text-lg font-medium py-2">
                Admin email : mijan.cse19@gmail.com, password : 12345678,project
                video link : https://youtu.be/6gMoyG0b1hc
            </span>

            <div
                className="relative h-[60vh] bg-cover bg-center"
                style={{
                    backgroundImage: `url('./background-image.webp')`
                }}
            >
                <Link
                    to="/login"
                    className="px-6 z-50 border-1 absolute right-4 top-2 mb-20 border-white py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-md shadow-md hover:shadow-pink-500/50 transition duration-300"
                >
                    Login
                </Link>

                {/* added this Admin button for testing purpose  */}
                <Link
                    to="/admin-dashboard"
                    className="px-6 z-50 border-1 absolute right-4 top-2 mb-20 border-white py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-md shadow-md hover:shadow-pink-500/50 transition duration-300"
                >
                    Admin
                </Link>

                <div className="absolute inset-0 bg-black/40" />
                <div className="relative w-full max-w-7xl mx-auto pt-10 p-4 h-full flex flex-col items-center justify-center">
                    <h1
                        className="text-4xl md:text-6xl font-bold text-white mb-8 transform transition-all duration-1000 ease-out"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible
                                ? 'translateY(0)'
                                : 'translateY(-20px)'
                        }}
                    >
                        EMPLOYEE MANAGEMENT SYSTEM
                    </h1>
                    <div className="relative overflow-hidden rounded-lg shadow-lg h-96 w-full max-w-4xl">
                        {images.map((img, index) => (
                            <Link
                                to="/login"
                                key={index}
                                className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${
                                    index === current
                                        ? 'translate-x-0 opacity-100 z-10'
                                        : index < current
                                        ? '-translate-x-full opacity-0 z-0'
                                        : 'translate-x-full opacity-0 z-0'
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`Slide ${index}`}
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        ))}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrent(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === current
                                            ? 'bg-white scale-125'
                                            : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Section */}
            <div className="px-2 py-6 sm:px-4 md:px-8 max-w-7xl mx-auto">
                <h2
                    className="text-2xl sm:text-3xl font-bold mb-8 text-center transform transition-all duration-1000 ease-out"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                            ? 'translateY(0)'
                            : 'translateY(20px)'
                    }}
                >
                    Dashboard Overview
                </h2>
                <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory hide-scrollbar">
                    {[...overview, ...leaves].map((item, index) => (
                        <Link
                            to="/login"
                            key={item.label}
                            className="transform  transition-all duration-1000 ease-out flex-none w-[280px] snap-center"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible
                                    ? 'translateX(0)'
                                    : 'translateX(100px)',
                                transitionDelay: `${index * 150}ms`
                            }}
                        >
                            <SummaryCard
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                                color={item.color}
                                card={item.card}
                            />
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default Home;

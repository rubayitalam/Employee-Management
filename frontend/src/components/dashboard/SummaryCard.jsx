import React from 'react';

const SummaryCard = ({ icon: Icon, label, value, color, card }) => {
    return (
        <div
            className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg ${card}`}
        >
            <div className={`p-2 sm:p-3 rounded-full ${color} text-white`}>
                {Icon && <Icon className="h-6 w-6 sm:h-7 sm:w-7" />}
            </div>
            <div>
                <div className="text-gray-700 font-medium text-sm sm:text-base">
                    {label}
                </div>
                <div className="text-xl sm:text-2xl font-bold mt-1">
                    {value}
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;

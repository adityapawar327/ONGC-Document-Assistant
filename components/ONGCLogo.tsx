/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const ONGCLogo: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => {
    return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer circle - Maroon */}
            <circle cx="50" cy="50" r="48" fill="#800020" stroke="#FFD700" strokeWidth="2"/>
            
            {/* Inner design - representing oil drop/flame */}
            <path d="M50 20 C35 35, 35 45, 50 60 C65 45, 65 35, 50 20 Z" fill="#FF8C00"/>
            <path d="M50 25 C40 37, 40 43, 50 55 C60 43, 60 37, 50 25 Z" fill="#FFD700"/>
            
            {/* Bottom text area */}
            <rect x="20" y="65" width="60" height="15" rx="2" fill="#FFD700"/>
            <text x="50" y="76" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#800020">ONGC</text>
        </svg>
    );
};

export default ONGCLogo;

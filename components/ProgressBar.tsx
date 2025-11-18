/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
    progress: number;
    total: number;
    message?: string;
    fileName?: string;
    icon?: React.ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total, message, fileName, icon }) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const percentage = Math.round((progress / total) * 100);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProgress(percentage);
        }, 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    const getStepInfo = () => {
        if (message?.includes('Creating') || message?.includes('बनाया')) {
            return { emoji: '📦', color: '#FFD700', label: 'Initializing' };
        } else if (message?.includes('Generating embeddings') || message?.includes('एम्बेडिंग')) {
            return { emoji: '🧠', color: '#FF8C00', label: 'Processing' };
        } else if (message?.includes('Generating suggestions') || message?.includes('सुझाव')) {
            return { emoji: '💡', color: '#FFA500', label: 'Analyzing' };
        } else if (message?.includes('All set') || message?.includes('तैयार')) {
            return { emoji: '✨', color: '#00FF00', label: 'Complete' };
        }
        return { emoji: '⚙️', color: '#FFD700', label: 'Processing' };
    };

    const stepInfo = getStepInfo();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #800020 0%, #5a0016 50%, #800020 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center'
            }}>


                {/* Progress Circle */}
                <div style={{
                    position: 'relative',
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 1.5rem'
                }}>
                    {/* Background Circle */}
                    <svg 
                        width="180" 
                        height="180" 
                        viewBox="0 0 180 180"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            transform: 'rotate(-90deg)'
                        }}
                    >
                        <circle
                            cx="90"
                            cy="90"
                            r="75"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="12"
                        />
                        <circle
                            cx="90"
                            cy="90"
                            r="75"
                            fill="none"
                            stroke={stepInfo.color}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 75}`}
                            strokeDashoffset={`${2 * Math.PI * 75 * (1 - animatedProgress / 100)}`}
                            style={{
                                transition: 'stroke-dashoffset 0.5s ease-out',
                                filter: `drop-shadow(0 0 8px ${stepInfo.color})`
                            }}
                        />
                    </svg>
                    
                    {/* Percentage Text */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#FFD700',
                        textShadow: '0 2px 10px rgba(255, 215, 0, 0.5)'
                    }}>
                        {animatedProgress}%
                    </div>
                </div>

                {/* Status Message */}
                <div style={{
                    marginBottom: '1.25rem'
                }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#FFD700',
                        marginBottom: '0.5rem',
                        textShadow: '0 2px 10px rgba(255, 215, 0, 0.3)'
                    }}>
                        {stepInfo.label}
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '0.5rem'
                    }}>
                        {message}
                    </p>
                    {fileName && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontFamily: 'monospace'
                        }}>
                            {fileName}
                        </p>
                    )}
                </div>



                {/* Loading Animation */}
                <div style={{
                    marginTop: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#FFD700',
                                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                            }}
                        />
                    ))}
                </div>

                <style>{`
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    
                    @keyframes pulse {
                        0%, 100% { 
                            opacity: 0.3;
                            transform: scale(0.8);
                        }
                        50% { 
                            opacity: 1;
                            transform: scale(1.2);
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ProgressBar;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import UploadCloudIcon from './icons/UploadCloudIcon';
import TrashIcon from './icons/TrashIcon';
import { useLanguage } from '../LanguageContext';

interface WelcomeScreenProps {
    onUpload: () => Promise<void>;
    apiKeyError: string | null;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    isApiKeySelected: boolean;
    onSelectKey: () => Promise<void>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
    onUpload, 
    apiKeyError, 
    files, 
    setFiles, 
    isApiKeySelected, 
    onSelectKey 
}) => {
    const { t } = useLanguage();
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (event.dataTransfer.files) {
            setFiles(prev => [...prev, ...Array.from(event.dataTransfer.files)]);
        }
    }, [setFiles]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isDragging) setIsDragging(true);
    }, [isDragging]);
    
    const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleConfirmUpload = async () => {
        try {
            await onUpload();
        } catch (error) {
            console.error("Upload process failed:", error);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #800020 0%, #5a0016 50%, #800020 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                fontFamily: 'Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}>
                <div style={{ maxWidth: '900px', width: '100%' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    {/* ONGC Logo */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <img 
                            src="/ongc-logo.png" 
                            alt="ONGC Logo" 
                            style={{
                                height: '100px',
                                width: 'auto',
                                objectFit: 'contain',
                                animation: 'fadeInScale 0.6s ease-out'
                            }}
                        />
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: '800',
                        color: '#FFD700',
                        marginBottom: '1rem',
                        textShadow: '0 4px 20px rgba(255, 215, 0, 0.5)',
                        letterSpacing: '-0.02em',
                        animation: 'fadeInUp 0.6s ease-out 0.1s both'
                    }}>
                        {t.appTitle}
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: '1.7',
                        animation: 'fadeInUp 0.6s ease-out 0.2s both'
                    }}>
                        {t.appSubtitle}
                    </p>
                    <div style={{
                        marginTop: '1.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        animation: 'fadeInUp 0.6s ease-out 0.3s both'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>AI-Powered</span>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Secure</span>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Fast</span>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {apiKeyError && (
                    <div style={{
                        marginBottom: '2rem',
                        padding: '1rem',
                        fontSize: '0.95rem',
                        color: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        {apiKeyError}
                    </div>
                )}

                {/* Upload Area */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    style={{
                        padding: '4rem 2.5rem',
                        border: isDragging ? '3px dashed #FFD700' : '3px dashed rgba(255, 255, 255, 0.4)',
                        borderRadius: '20px',
                        backgroundColor: isDragging ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        marginBottom: '2rem',
                        backdropFilter: 'blur(10px)',
                        boxShadow: isDragging ? '0 8px 32px rgba(255, 215, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.2)',
                        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                        animation: 'fadeInUp 0.6s ease-out 0.4s both'
                    }}
                >
                    <div style={{ 
                        marginBottom: '1.5rem', 
                        display: 'flex', 
                        justifyContent: 'center',
                        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <UploadCloudIcon />
                    </div>
                    <p style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        color: '#fff',
                        marginBottom: '0.75rem'
                    }}>
                        {t.dragDropText}
                    </p>
                    <p style={{
                        fontSize: '1rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '2rem',
                        fontWeight: '500'
                    }}>
                        PDF • Word • Excel • Text
                    </p>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept=".pdf,.txt,.md,.doc,.docx,.xls,.xlsx"
                    />
                    <label
                        htmlFor="file-upload"
                        style={{
                            display: 'inline-block',
                            padding: '1.1rem 2.5rem',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: '#800020',
                            background: 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
                        }}
                    >
                        {t.browseFiles}
                    </label>
                </div>

                {/* Selected Files */}
                {files.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#fff',
                            marginBottom: '1rem'
                        }}>
                            {t.selectedFiles} ({files.length})
                        </h4>
                        <div style={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            paddingRight: '0.5rem'
                        }}>
                            {files.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        marginBottom: '0.75rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '10px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    }}
                                >
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: '#fff',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1
                                    }}>
                                        {file.name}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: 'rgba(255, 255, 255, 0.6)'
                                        }}>
                                            {(file.size / 1024).toFixed(2)} KB
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            style={{
                                                padding: '0.4rem',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                color: '#ff6b6b',
                                                cursor: 'pointer',
                                                borderRadius: '6px',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                            aria-label={`${t.remove} ${file.name}`}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upload Button */}
                {files.length > 0 && (
                    <button
                        type="button"
                        onClick={handleConfirmUpload}
                        style={{
                            width: '100%',
                            padding: '1.4rem',
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            color: '#800020',
                            background: 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 6px 25px rgba(255, 215, 0, 0.5)',
                            marginBottom: '2rem',
                            animation: 'fadeInUp 0.4s ease-out'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 35px rgba(255, 215, 0, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 215, 0, 0.5)';
                        }}
                    >
                        {t.uploadAndChat}
                    </button>
                )}

                {/* How to Use Instructions */}
                <div style={{
                    padding: '2rem',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '20px',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    marginBottom: '2rem',
                    animation: 'fadeInUp 0.6s ease-out 0.5s both'
                }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        color: '#FFD700',
                        marginBottom: '1.5rem'
                    }}>
                        {t.howToUse}
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem'
                    }}>
                        {[
                            { step: '1', title: t.step1Title, desc: t.step1Desc },
                            { step: '2', title: t.step2Title, desc: t.step2Desc },
                            { step: '3', title: t.step3Title, desc: t.step3Desc },
                            { step: '4', title: t.step4Title, desc: t.step4Desc }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'flex-start',
                                    padding: '1rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <div style={{
                                    minWidth: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    color: '#800020',
                                    flexShrink: 0
                                }}>
                                    {item.step}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: '#FFD700',
                                        marginBottom: '0.4rem'
                                    }}>
                                        {item.title}
                                    </div>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        lineHeight: '1.5',
                                        margin: 0
                                    }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Card */}
                <div style={{
                    padding: '2rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    animation: 'fadeInUp 0.6s ease-out 0.6s both'
                }}>
                    <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: '#FFD700',
                        marginBottom: '1.25rem'
                    }}>
                        {t.supportedFileTypes}
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem'
                    }}>
                        {[
                            { label: 'PDF Documents', ext: '.pdf' },
                            { label: 'Word Documents', ext: '.docx' },
                            { label: 'Excel Spreadsheets', ext: '.xlsx' },
                            { label: 'Text Files', ext: '.txt' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem',
                                    padding: '0.75rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>{item.label}</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>{item.ext}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{
                        marginTop: '1rem',
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textAlign: 'center',
                        lineHeight: '1.5'
                    }}>
                        {t.uploadDescription}
                    </p>
                </div>
            </div>
        </div>
        </>
    );
};

export default WelcomeScreen;

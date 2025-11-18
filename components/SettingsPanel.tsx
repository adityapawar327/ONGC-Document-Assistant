/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useLanguage } from '../LanguageContext';

export type AccuracyMode = 'very-accurate' | 'moderate' | 'creative';
export type ContextWindow = 'short' | 'medium' | 'high';

interface SettingsPanelProps {
    accuracyMode: AccuracyMode;
    contextWindow: ContextWindow;
    onAccuracyChange: (mode: AccuracyMode) => void;
    onContextChange: (window: ContextWindow) => void;
    isOpen: boolean;
    onClose: () => void;
    uploadedFiles?: string[];
    onRemoveFile?: (fileName: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    accuracyMode,
    contextWindow,
    onAccuracyChange,
    onContextChange,
    isOpen,
    onClose,
    uploadedFiles = [],
    onRemoveFile
}) => {
    const { language } = useLanguage();

    const accuracyOptions = {
        'very-accurate': {
            en: { label: 'Very Accurate', desc: 'Strict responses only from uploaded documents' },
            hi: { label: 'बहुत सटीक', desc: 'केवल अपलोड किए गए दस्तावेज़ों से सख्त उत्तर' }
        },
        'moderate': {
            en: { label: 'Moderate', desc: 'Balanced approach with mostly document-based answers' },
            hi: { label: 'मध्यम', desc: 'अधिकतर दस्तावेज़-आधारित उत्तरों के साथ संतुलित दृष्टिकोण' }
        },
        'creative': {
            en: { label: 'Creative', desc: 'Flexible responses with general knowledge' },
            hi: { label: 'रचनात्मक', desc: 'सामान्य ज्ञान के साथ लचीले उत्तर' }
        }
    };

    const contextOptions = {
        'short': {
            en: { label: 'Short (4 chunks)', desc: 'Quick answers' },
            hi: { label: 'छोटा (4 खंड)', desc: 'त्वरित उत्तर' }
        },
        'medium': {
            en: { label: 'Medium (8 chunks)', desc: 'Balanced (default)' },
            hi: { label: 'मध्यम (8 खंड)', desc: 'संतुलित (डिफ़ॉल्ट)' }
        },
        'high': {
            en: { label: 'High (15 chunks)', desc: 'Comprehensive answers' },
            hi: { label: 'उच्च (15 खंड)', desc: 'व्यापक उत्तर' }
        }
    };

    const titles = {
        en: {
            settings: 'Settings',
            accuracy: 'Accuracy Mode',
            context: 'Context Window',
            uploadedFiles: 'Uploaded Files',
            noFiles: 'No files uploaded yet',
            remove: 'Remove',
            close: 'Close'
        },
        hi: {
            settings: 'सेटिंग्स',
            accuracy: 'सटीकता मोड',
            context: 'संदर्भ विंडो',
            uploadedFiles: 'अपलोड की गई फ़ाइलें',
            noFiles: 'अभी तक कोई फ़ाइल अपलोड नहीं की गई',
            remove: 'हटाएं',
            close: 'बंद करें'
        }
    };

    const t = titles[language];

    if (!isOpen) return null;

    return (
        <div 
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: '#5a0016',
                    padding: '2rem',
                    borderRadius: '16px',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
            >
                <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#FFD700',
                    marginBottom: '1.5rem'
                }}>
                    {t.settings}
                </h2>

                {/* Accuracy Mode */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#fff',
                        marginBottom: '1rem'
                    }}>
                        {t.accuracy}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(Object.keys(accuracyOptions) as AccuracyMode[]).map(mode => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => onAccuracyChange(mode)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    border: accuracyMode === mode 
                                        ? '2px solid #FF8C00' 
                                        : '2px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: accuracyMode === mode 
                                        ? 'rgba(255, 140, 0, 0.2)' 
                                        : 'rgba(255, 255, 255, 0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (accuracyMode !== mode) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (accuracyMode !== mode) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                            >
                                <div style={{
                                    fontWeight: '600',
                                    color: '#fff',
                                    marginBottom: '0.25rem'
                                }}>
                                    {accuracyOptions[mode][language].label}
                                </div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }}>
                                    {accuracyOptions[mode][language].desc}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Context Window */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#fff',
                        marginBottom: '1rem'
                    }}>
                        {t.context}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(Object.keys(contextOptions) as ContextWindow[]).map(window => (
                            <button
                                key={window}
                                type="button"
                                onClick={() => onContextChange(window)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    border: contextWindow === window 
                                        ? '2px solid #FFD700' 
                                        : '2px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: contextWindow === window 
                                        ? 'rgba(255, 215, 0, 0.2)' 
                                        : 'rgba(255, 255, 255, 0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (contextWindow !== window) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (contextWindow !== window) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                            >
                                <div style={{
                                    fontWeight: '600',
                                    color: '#fff',
                                    marginBottom: '0.25rem'
                                }}>
                                    {contextOptions[window][language].label}
                                </div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }}>
                                    {contextOptions[window][language].desc}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Uploaded Files Section */}
                {uploadedFiles.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#fff',
                            marginBottom: '1rem'
                        }}>
                            {t.uploadedFiles} ({uploadedFiles.length})
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            padding: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px'
                        }}>
                            {uploadedFiles.map((fileName, index) => (
                                <div
                                    key={`${fileName}-${index}`}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.75rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    <span style={{
                                        fontSize: '0.85rem',
                                        color: '#fff',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1,
                                        marginRight: '0.5rem'
                                    }}>
                                        📄 {fileName}
                                    </span>
                                    {onRemoveFile && (
                                        <button
                                            type="button"
                                            onClick={() => onRemoveFile(fileName)}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                color: '#fff',
                                                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                                                border: '1px solid rgba(255, 107, 107, 0.4)',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                whiteSpace: 'nowrap'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                                            }}
                                            aria-label={`Remove ${fileName}`}
                                        >
                                            {t.remove}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: '0.75rem 2rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#800020',
                            background: 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;

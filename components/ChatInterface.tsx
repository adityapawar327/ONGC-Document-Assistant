/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import Spinner from './Spinner';
import SendIcon from './icons/SendIcon';
import RefreshIcon from './icons/RefreshIcon';
import SettingsIcon from './icons/SettingsIcon';
import PaperclipIcon from './icons/PaperclipIcon';
import TrashIcon from './icons/TrashIcon';
import SettingsPanel, { AccuracyMode, ContextWindow } from './SettingsPanel';
import { useLanguage } from '../LanguageContext';

interface ChatInterfaceProps {
    documentName: string;
    history: ChatMessage[];
    isQueryLoading: boolean;
    onSendMessage: (message: string, accuracyMode: AccuracyMode, contextWindow: ContextWindow) => void;
    onNewChat: () => void;
    exampleQuestions: string[];
    onAddFiles?: (files: File[]) => Promise<void>;
    uploadedFiles?: string[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    documentName, 
    history, 
    isQueryLoading, 
    onSendMessage, 
    onNewChat, 
    exampleQuestions,
    onAddFiles,
    uploadedFiles = []
}) => {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [accuracyMode, setAccuracyMode] = useState<AccuracyMode>('moderate');
    const [contextWindow, setContextWindow] = useState<ContextWindow>('medium');
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRemoveUploadedFile = (fileName: string) => {
        // Show confirmation dialog
        const confirmMessage = t.removeFileConfirm.replace('{fileName}', fileName);
        if (window.confirm(confirmMessage)) {
            // Removing a file requires restarting the chat session
            // because we can't remove files from an existing RAG store
            onNewChat();
        }
    };

    // Show multiple suggestions instead of rotating
    
    const renderMarkdown = (text: string) => {
        if (!text) return { __html: '' };

        const lines = text.split('\n');
        let html = '';
        let listType: 'ul' | 'ol' | null = null;
        let paraBuffer = '';

        function flushPara() {
            if (paraBuffer) {
                html += `<p style="margin: 0.5rem 0;">${paraBuffer}</p>`;
                paraBuffer = '';
            }
        }

        function flushList() {
            if (listType) {
                html += `</${listType}>`;
                listType = null;
            }
        }

        for (const rawLine of lines) {
            const line = rawLine
                .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>')
                .replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>')
                .replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace;">$1</code>');

            const isOl = line.match(/^\s*\d+\.\s(.*)/);
            const isUl = line.match(/^\s*[\*\-]\s(.*)/);

            if (isOl) {
                flushPara();
                if (listType !== 'ol') {
                    flushList();
                    html += '<ol style="margin: 0.5rem 0; padding-left: 1.5rem;">';
                    listType = 'ol';
                }
                html += `<li style="margin: 0.25rem 0;">${isOl[1]}</li>`;
            } else if (isUl) {
                flushPara();
                if (listType !== 'ul') {
                    flushList();
                    html += '<ul style="margin: 0.5rem 0; padding-left: 1.5rem;">';
                    listType = 'ul';
                }
                html += `<li style="margin: 0.25rem 0;">${isUl[1]}</li>`;
            } else {
                flushList();
                if (line.trim() === '') {
                    flushPara();
                } else {
                    paraBuffer += (paraBuffer ? '<br/>' : '') + line;
                }
            }
        }

        flushPara();
        flushList();

        return { __html: html };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSendMessage(query, accuracyMode, contextWindow);
            setQuery('');
        }
    };

    const handleSourceClick = (text: string) => {
        setModalContent(text);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAdditionalFiles(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setAdditionalFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleUploadAdditionalFiles = async () => {
        if (additionalFiles.length > 0 && onAddFiles) {
            setIsUploadingFiles(true);
            try {
                await onAddFiles(additionalFiles);
                setAdditionalFiles([]);
            } catch (error) {
                console.error("Failed to upload additional files:", error);
            } finally {
                setIsUploadingFiles(false);
            }
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isQueryLoading]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #800020 0%, #5a0016 50%, #800020 100%)',
            fontFamily: 'Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
            {/* Header */}
            <header style={{
                padding: '1rem 1.5rem',
                paddingRight: '8rem',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
                gap: '0.75rem',
                position: 'relative'
            }}>
                <h1 style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    fontWeight: '600',
                    color: '#FFD700',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: '1 1 auto',
                    fontFamily: 'Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}>
                    {t.chatWith} {documentName}
                </h1>
                <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    flexShrink: 0
                }}>
                    <button
                        type="button"
                        onClick={() => setIsSettingsOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#fff',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            minHeight: '38px',
                            fontFamily: 'Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <SettingsIcon />
                        <span>{t.settings}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onNewChat}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#800020',
                            background: 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
                            border: 'none',
                            minHeight: '38px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            fontFamily: 'Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <RefreshIcon />
                        <span>{t.newChat}</span>
                    </button>
                </div>
            </header>

            {/* Chat Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                    {history.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: '1.5rem'
                            }}
                        >
                            <div style={{
                                maxWidth: '75%',
                                padding: '1rem 1.25rem',
                                borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                background: message.role === 'user' 
                                    ? 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                color: '#fff',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                boxShadow: message.role === 'user' 
                                    ? '0 2px 8px rgba(255, 140, 0, 0.3)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.2)'
                            }}>
                                <div dangerouslySetInnerHTML={renderMarkdown(message.parts[0].text)} />
                                {message.role === 'model' && message.groundingChunks && message.groundingChunks.length > 0 && (
                                    <div style={{
                                        marginTop: '1rem',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}>
                                        <h4 style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            marginBottom: '0.5rem',
                                            textAlign: 'right'
                                        }}>
                                            {t.sources}
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem',
                                            justifyContent: 'flex-end'
                                        }}>
                                            {message.groundingChunks.map((chunk, chunkIndex) => (
                                                chunk.retrievedContext?.text && (
                                                    <button
                                                        type="button"
                                                        key={chunkIndex}
                                                        onClick={() => handleSourceClick(chunk.retrievedContext!.text!)}
                                                        style={{
                                                            padding: '0.4rem 0.8rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            color: '#FFD700',
                                                            backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                                            border: '1px solid rgba(255, 215, 0, 0.3)',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                                                        }}
                                                    >
                                                        Source {chunkIndex + 1}
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isQueryLoading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{
                                padding: '1rem 1.25rem',
                                borderRadius: '18px 18px 18px 4px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <Spinner />
                                <span style={{ color: '#fff', fontSize: '0.9rem' }}>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                flexShrink: 0
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {/* Additional Files Section */}
                    {additionalFiles.length > 0 && (
                        <div style={{
                            marginBottom: '1rem',
                            padding: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.75rem'
                            }}>
                                <h4 style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#FFD700',
                                    margin: 0
                                }}>
                                    Files to Upload ({additionalFiles.length})
                                </h4>
                                <button
                                    type="button"
                                    onClick={handleUploadAdditionalFiles}
                                    disabled={isUploadingFiles}
                                    style={{
                                        padding: '0.4rem 1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: '#800020',
                                        background: isUploadingFiles 
                                            ? 'rgba(255, 255, 255, 0.3)' 
                                            : 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: isUploadingFiles ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {isUploadingFiles ? 'Uploading...' : 'Upload Now'}
                                </button>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                maxHeight: '150px',
                                overflowY: 'auto'
                            }}>
                                {additionalFiles.map((file, index) => (
                                    <div
                                        key={`${file.name}-${index}`}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.6rem 0.8rem',
                                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: '#fff',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            flex: 1
                                        }}>
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            style={{
                                                padding: '0.3rem',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                color: '#ff6b6b',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginLeft: '0.5rem'
                                            }}
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {!isQueryLoading && exampleQuestions.length > 0 && history.length === 0 && (
                        <div style={{
                            marginBottom: '1rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            justifyContent: 'center'
                        }}>
                            {exampleQuestions.slice(0, 4).map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setQuery(suggestion)}
                                    title={suggestion}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        fontSize: '0.8rem',
                                        color: '#fff',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        maxWidth: '300px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                                        e.currentTarget.style.borderColor = '#FFD700';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    }}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {/* Input Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input
                            id="additional-file-upload"
                            type="file"
                            ref={fileInputRef}
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                            accept=".pdf,.txt,.md,.doc,.docx,.xls,.xlsx"
                            aria-label="Upload additional files"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isQueryLoading}
                            style={{
                                padding: '1rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                cursor: isQueryLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFD700',
                                opacity: isQueryLoading ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!isQueryLoading) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                                    e.currentTarget.style.borderColor = '#FFD700';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                            title="Add files"
                        >
                            <PaperclipIcon />
                        </button>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t.askQuestion}
                            disabled={isQueryLoading}
                            style={{
                                flex: 1,
                                padding: '1rem 1.25rem',
                                fontSize: '0.95rem',
                                color: '#fff',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                outline: 'none',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.borderColor = '#FFD700';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isQueryLoading || !query.trim()}
                            aria-label="Send message"
                            style={{
                                padding: '1rem',
                                background: (isQueryLoading || !query.trim()) 
                                    ? 'rgba(255, 255, 255, 0.1)' 
                                    : 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: (isQueryLoading || !query.trim()) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: (isQueryLoading || !query.trim()) ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!isQueryLoading && query.trim()) {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>

            {/* Settings Panel */}
            <SettingsPanel
                accuracyMode={accuracyMode}
                contextWindow={contextWindow}
                onAccuracyChange={setAccuracyMode}
                onContextChange={setContextWindow}
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                uploadedFiles={uploadedFiles}
                onRemoveFile={handleRemoveUploadedFile}
            />

            {/* Source Modal */}
            {modalContent !== null && (
                <div
                    onClick={closeModal}
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
                            maxWidth: '700px',
                            width: '100%',
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#FFD700',
                            marginBottom: '1rem'
                        }}>
                            {t.sourceText}
                        </h3>
                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem',
                                lineHeight: '1.6',
                                padding: '1rem',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '8px',
                                marginBottom: '1.5rem'
                            }}
                            dangerouslySetInnerHTML={renderMarkdown(modalContent || '')}
                        />
                        <button
                            type="button"
                            onClick={closeModal}
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#800020',
                                background: 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                alignSelf: 'flex-end'
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
            )}
        </div>
    );
};

export default ChatInterface;

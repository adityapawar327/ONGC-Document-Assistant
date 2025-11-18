/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { AppStatus, ChatMessage } from './types';
import * as geminiService from './services/geminiService';
import Spinner from './components/Spinner';
import WelcomeScreen from './components/WelcomeScreen';
import ProgressBar from './components/ProgressBar';
import ChatInterface from './components/ChatInterface';
import LanguageToggle from './components/LanguageToggle';
import { useLanguage } from './LanguageContext';

declare global {
    interface Window {
        aistudio?: {
            openSelectKey: () => Promise<void>;
            hasSelectedApiKey: () => Promise<boolean>;
        };
    }
}

const App: React.FC = () => {
    const { t } = useLanguage();
    const [status, setStatus] = useState<AppStatus>(AppStatus.Welcome);
    const [isApiKeySelected, setIsApiKeySelected] = useState(true);
    const [apiKeyError, setApiKeyError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<{ current: number, total: number, message?: string, fileName?: string } | null>(null);
    const [activeRagStoreName, setActiveRagStoreName] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isQueryLoading, setIsQueryLoading] = useState(false);
    const [exampleQuestions, setExampleQuestions] = useState<string[]>([]);
    const [documentName, setDocumentName] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const ragStoreNameRef = useRef(activeRagStoreName);

    useEffect(() => {
        ragStoreNameRef.current = activeRagStoreName;
    }, [activeRagStoreName]);

    useEffect(() => {
        const handleUnload = () => {
            if (ragStoreNameRef.current) {
                geminiService.deleteRagStore(ragStoreNameRef.current)
                    .catch(err => console.error("Error deleting RAG store on unload:", err));
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);


    const handleError = (message: string, err: any) => {
        console.error(message, err);
        setError(`${message}${err ? `: ${err instanceof Error ? err.message : String(err)}` : ''}`);
        setStatus(AppStatus.Error);
    };

    const clearError = () => {
        setError(null);
        setStatus(AppStatus.Welcome);
    }



    const handleUploadAndStartChat = async () => {
        if (files.length === 0) return;
        
        setApiKeyError(null);

        try {
            geminiService.initialize();
        } catch (err) {
            handleError("Initialization failed. Please check your API Key.", err);
            throw err;
        }
        
        setStatus(AppStatus.Uploading);
        const totalSteps = files.length + 2;
        setUploadProgress({ current: 0, total: totalSteps, message: t.creatingIndex });

        try {
            const storeName = `chat-session-${Date.now()}`;
            const ragStoreName = await geminiService.createRagStore(storeName);
            
            setUploadProgress({ current: 1, total: totalSteps, message: t.generatingEmbeddings });

            const fileNames: string[] = [];
            for (let i = 0; i < files.length; i++) {
                setUploadProgress((prev) => ({ 
                    ...(prev || { current: 0, total: totalSteps }),
                    current: i + 1,
                    message: t.generatingEmbeddings,
                    fileName: `(${i + 1}/${files.length}) ${files[i].name}`
                }));
                await geminiService.uploadToRagStore(ragStoreName, files[i]);
                fileNames.push(files[i].name);
            }
            setUploadedFiles(fileNames);
            
            setUploadProgress({ current: files.length + 1, total: totalSteps, message: t.generatingSuggestions, fileName: "" });
            const questions = await geminiService.generateExampleQuestions(ragStoreName);
            setExampleQuestions(questions);

            setUploadProgress({ current: totalSteps, total: totalSteps, message: t.allSet, fileName: "" });
            
            await new Promise(resolve => setTimeout(resolve, 500)); // Short delay to show "All set!"

            let docName = '';
            if (files.length === 1) {
                docName = files[0].name;
            } else if (files.length === 2) {
                docName = `${files[0].name} & ${files[1].name}`;
            } else {
                docName = `${files.length} documents`;
            }
            setDocumentName(docName);

            setActiveRagStoreName(ragStoreName);
            setChatHistory([]);
            setStatus(AppStatus.Chatting);
            // Don't clear files - keep them for reference
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
            if (errorMessage.includes('api key not valid') || errorMessage.includes('requested entity was not found')) {
                setApiKeyError("The selected API key is invalid. Please select a different one and try again.");
                setIsApiKeySelected(false);
                setStatus(AppStatus.Welcome);
            } else {
                handleError("Failed to start chat session", err);
            }
            throw err;
        } finally {
            setUploadProgress(null);
        }
    };

    const handleEndChat = () => {
        if (activeRagStoreName) {
            geminiService.deleteRagStore(activeRagStoreName).catch(err => {
                console.error("Failed to delete RAG store in background", err);
            });
        }
        setActiveRagStoreName(null);
        setChatHistory([]);
        setExampleQuestions([]);
        setDocumentName('');
        setFiles([]);
        setUploadedFiles([]);
        setStatus(AppStatus.Welcome);
    };

    const handleAddFiles = async (newFiles: File[]) => {
        if (!activeRagStoreName || newFiles.length === 0) return;

        try {
            const newFileNames: string[] = [];
            for (const file of newFiles) {
                await geminiService.uploadToRagStore(activeRagStoreName, file);
                newFileNames.push(file.name);
            }
            
            // Update uploaded files list
            setUploadedFiles(prev => [...prev, ...newFileNames]);
            
            // Update document name to reflect new files
            const allFileCount = uploadedFiles.length + newFiles.length;
            let docName = '';
            if (allFileCount === 1) {
                docName = newFileNames[0];
            } else if (allFileCount === 2) {
                docName = `${uploadedFiles[0] || newFileNames[0]} & ${newFileNames[newFileNames.length - 1]}`;
            } else {
                docName = `${allFileCount} documents`;
            }
            setDocumentName(docName);
            
            // Regenerate example questions with new context
            const questions = await geminiService.generateExampleQuestions(activeRagStoreName);
            setExampleQuestions(questions);
        } catch (err) {
            handleError("Failed to add files", err);
            throw err;
        }
    };

    const handleSendMessage = async (
        message: string, 
        accuracyMode: 'very-accurate' | 'moderate' | 'creative' = 'moderate',
        contextWindow: 'short' | 'medium' | 'high' = 'medium'
    ) => {
        if (!activeRagStoreName) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
        setChatHistory((prev) => [...prev, userMessage]);
        setIsQueryLoading(true);

        try {
            const result = await geminiService.fileSearch(activeRagStoreName, message, {
                accuracyMode,
                contextWindow
            });
            const modelMessage: ChatMessage = {
                role: 'model',
                parts: [{ text: result.text }],
                groundingChunks: result.groundingChunks
            };
            setChatHistory((prev) => [...prev, modelMessage]);
        } catch (err) {
            const errorMessage: ChatMessage = {
                role: 'model',
                parts: [{ text: "Sorry, I encountered an error. Please try again." }]
            };
            setChatHistory((prev) => [...prev, errorMessage]);
            handleError("Failed to get response", err);
        } finally {
            setIsQueryLoading(false);
        }
    };
    
    const renderContent = () => {
        switch(status) {
            case AppStatus.Initializing:
                return (
                    <div className="flex items-center justify-center h-screen">
                        <Spinner /> <span className="ml-4 text-xl">{t.initializing}</span>
                    </div>
                );
            case AppStatus.Welcome:
                 return <WelcomeScreen onUpload={handleUploadAndStartChat} apiKeyError={apiKeyError} files={files} setFiles={setFiles} isApiKeySelected={isApiKeySelected} onSelectKey={() => Promise.resolve()} />;
            case AppStatus.Uploading:
                let icon = null;
                if (uploadProgress?.message === t.creatingIndex) {
                    icon = <img src="https://services.google.com/fh/files/misc/applet-upload.png" alt="Uploading files icon" className="h-80 w-80 rounded-lg object-cover" />;
                } else if (uploadProgress?.message === t.generatingEmbeddings) {
                    icon = <img src="https://services.google.com/fh/files/misc/applet-creating-embeddings_2.png" alt="Creating embeddings icon" className="h-240 w-240 rounded-lg object-cover" />;
                } else if (uploadProgress?.message === t.generatingSuggestions) {
                    icon = <img src="https://services.google.com/fh/files/misc/applet-suggestions_2.png" alt="Generating suggestions icon" className="h-240 w-240 rounded-lg object-cover" />;
                } else if (uploadProgress?.message === t.allSet) {
                    icon = <img src="https://services.google.com/fh/files/misc/applet-completion_2.png" alt="Completion icon" className="h-240 w-240 rounded-lg object-cover" />;
                }

                return <ProgressBar 
                    progress={uploadProgress?.current || 0} 
                    total={uploadProgress?.total || 1} 
                    message={uploadProgress?.message || "Preparing your chat..."} 
                    fileName={uploadProgress?.fileName}
                    icon={icon}
                />;
            case AppStatus.Chatting:
                return <ChatInterface 
                    documentName={documentName}
                    history={chatHistory}
                    isQueryLoading={isQueryLoading}
                    onSendMessage={handleSendMessage}
                    onNewChat={handleEndChat}
                    exampleQuestions={exampleQuestions}
                    onAddFiles={handleAddFiles}
                    uploadedFiles={uploadedFiles}
                />;
            case AppStatus.Error:
                 return (
                    <div className="flex flex-col items-center justify-center h-screen bg-red-900/20 text-red-300">
                        <h1 className="text-3xl font-bold mb-4">{t.errorTitle}</h1>
                        <p className="max-w-md text-center mb-4">{error}</p>
                        <button type="button" onClick={clearError} className="px-4 py-2 rounded-md bg-gem-mist hover:bg-gem-mist/70 transition-colors" title="Return to the welcome screen">
                           {t.tryAgain}
                        </button>
                    </div>
                );
            default:
                 return <WelcomeScreen onUpload={handleUploadAndStartChat} apiKeyError={apiKeyError} files={files} setFiles={setFiles} isApiKeySelected={isApiKeySelected} onSelectKey={() => Promise.resolve()} />;
        }
    }

    return (
        <main className="h-screen bg-gem-onyx text-gem-offwhite">
            <LanguageToggle />
            {renderContent()}
        </main>
    );
};

export default App;

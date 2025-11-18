/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { QueryResult } from '../types';

let ai: GoogleGenAI;

export function initialize() {
    // Get API key from environment variable (set in .env.local as VITE_API_KEY)
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("API key not found. Please set VITE_API_KEY in .env.local file");
    }
    ai = new GoogleGenAI({ apiKey });
}

async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createRagStore(displayName: string): Promise<string> {
    if (!ai) throw new Error("Gemini AI not initialized");
    const ragStore = await ai.fileSearchStores.create({ config: { displayName } });
    if (!ragStore.name) {
        throw new Error("Failed to create RAG store: name is missing.");
    }
    return ragStore.name as string;
}

export async function uploadToRagStore(ragStoreName: string, file: File): Promise<void> {
    if (!ai) throw new Error("Gemini AI not initialized");
    
    let op = await ai.fileSearchStores.uploadToFileSearchStore({
        fileSearchStoreName: ragStoreName,
        file: file
    });

    while (!op.done) {
        await delay(3000);
        op = await ai.operations.get({operation: op});
    }
}

export interface FileSearchOptions {
    accuracyMode?: 'very-accurate' | 'moderate' | 'creative';
    contextWindow?: 'short' | 'medium' | 'high';
}

export async function fileSearch(
    ragStoreName: string, 
    query: string, 
    options: FileSearchOptions = {}
): Promise<QueryResult> {
    if (!ai) throw new Error("Gemini AI not initialized");
    
    const { accuracyMode = 'moderate', contextWindow = 'medium' } = options;
    
    // Build system instruction based on accuracy mode
    let systemInstruction = "DO NOT ASK THE USER TO READ THE MANUAL, pinpoint the relevant sections in the response itself. ";
    
    if (accuracyMode === 'very-accurate') {
        systemInstruction += "IMPORTANT: Only provide information that is explicitly stated in the uploaded documents. If the answer is not in the documents, clearly state that you don't have that information in the provided materials.";
    } else if (accuracyMode === 'moderate') {
        systemInstruction += "Primarily use information from the uploaded documents, but you may supplement with general knowledge when appropriate.";
    } else if (accuracyMode === 'creative') {
        systemInstruction += "Use the uploaded documents as a reference, but feel free to provide comprehensive answers using your general knowledge when helpful.";
    }
    
    const contextHint = contextWindow === 'short' 
        ? " Keep the response concise and focused." 
        : contextWindow === 'high' 
        ? " Provide a comprehensive and detailed response." 
        : "";
    
    // Retry logic for network errors
    let lastError: any;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: query + " " + systemInstruction + contextHint,
                config: {
                    tools: [
                        {
                            fileSearch: {
                                fileSearchStoreNames: [ragStoreName]
                            }
                        }
                    ]
                }
            });

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            return {
                text: response.text || '',
                groundingChunks: groundingChunks,
            };
        } catch (error) {
            lastError = error;
            console.error(`Attempt ${attempt + 1} failed:`, error);
            
            // If it's a network error and not the last attempt, wait and retry
            if (attempt < 2 && (error instanceof TypeError || (error as any)?.message?.includes('fetch'))) {
                await delay(1000 * (attempt + 1)); // Exponential backoff: 1s, 2s
                continue;
            }
            
            // If it's not a network error or last attempt, throw immediately
            throw error;
        }
    }
    
    throw lastError;
}

export async function generateExampleQuestions(ragStoreName: string): Promise<string[]> {
    if (!ai) throw new Error("Gemini AI not initialized");
    
    // Fallback questions if generation fails
    const fallbackQuestions = [
        "What are the main topics covered in this document?",
        "Can you summarize the key points?",
        "What safety procedures are mentioned?",
        "What are the technical specifications?"
    ];
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are analyzing documents that have been uploaded to a RAG system. Your task is to:

1. Read and understand the ACTUAL content of the uploaded documents
2. Generate 6 specific, relevant questions based on what's ACTUALLY in these documents
3. Questions should be practical and answerable from the document content
4. Focus on: key topics, technical details, procedures, specifications, dates, requirements, or important information found in the documents

IMPORTANT: Base your questions on the ACTUAL document content, not generic topics.

Return ONLY a JSON array of 6 question strings in this exact format:
["Question about specific topic from document?", "Question about another specific detail?", "Question about procedure mentioned?", "Question about specification found?", "Question about requirement stated?", "Question about information in document?"]

Generate the questions now based on the uploaded documents:`,
            config: {
                tools: [
                    {
                        fileSearch: {
                            fileSearchStoreNames: [ragStoreName],
                        }
                    }
                ]
            }
        });
        
        let jsonText = (response.text || '').trim();

        const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            jsonText = jsonMatch[1];
        } else {
            const firstBracket = jsonText.indexOf('[');
            const lastBracket = jsonText.lastIndexOf(']');
            if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
                jsonText = jsonText.substring(firstBracket, lastBracket + 1);
            }
        }
        
        const parsedData = JSON.parse(jsonText);
        
        if (Array.isArray(parsedData)) {
            if (parsedData.length === 0) {
                return [];
            }
            const firstItem = parsedData[0];

            // Handle new format: array of {product, questions[]}
            if (typeof firstItem === 'object' && firstItem !== null && 'questions' in firstItem && Array.isArray(firstItem.questions)) {
                return parsedData.flatMap(item => (item.questions || [])).filter(q => typeof q === 'string');
            }
            
            // Handle old format: array of strings
            if (typeof firstItem === 'string') {
                return parsedData.filter(q => typeof q === 'string');
            }
        }
        
        console.warn("Received unexpected format for example questions:", parsedData);
        return fallbackQuestions;
    } catch (error) {
        console.error("Failed to generate or parse example questions:", error);
        return fallbackQuestions;
    }
}


export async function deleteRagStore(ragStoreName: string): Promise<void> {
    if (!ai) throw new Error("Gemini AI not initialized");
    // DO: Remove `(as any)` type assertion.
    await ai.fileSearchStores.delete({
        name: ragStoreName,
        config: { force: true },
    });
}
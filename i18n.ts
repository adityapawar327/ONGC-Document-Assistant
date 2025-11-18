/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type Language = 'en' | 'hi';

export interface Translations {
    appTitle: string;
    appSubtitle: string;
    selectApiKey: string;
    apiKeySelected: string;
    dragDropText: string;
    browseFiles: string;
    selectedFiles: string;
    uploadAndChat: string;
    tryExample: string;
    newChat: string;
    chatWith: string;
    askQuestion: string;
    sources: string;
    sourceText: string;
    close: string;
    tryPrompt: string;
    initializing: string;
    creatingIndex: string;
    generatingEmbeddings: string;
    generatingSuggestions: string;
    allSet: string;
    errorTitle: string;
    tryAgain: string;
    remove: string;
    send: string;
    settings: string;
    removeFileConfirm: string;
    howToUse: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    supportedFileTypes: string;
    uploadDescription: string;
}

export const translations: Record<Language, Translations> = {
    en: {
        appTitle: 'ONGC Document Assistant',
        appSubtitle: 'AI-powered intelligent search for technical manuals, safety procedures, and operational documentation.',
        selectApiKey: 'Select Gemini API Key to Begin',
        apiKeySelected: '✓ API Key Selected',
        dragDropText: 'Drag & drop your files here.',
        browseFiles: 'Or Browse Files',
        selectedFiles: 'Selected Files',
        uploadAndChat: 'Upload and Chat',
        tryExample: 'Try an example:',
        newChat: 'New Chat',
        chatWith: 'Chat with',
        askQuestion: 'Ask a question about the documents...',
        sources: 'Sources:',
        sourceText: 'Source Text',
        close: 'Close',
        tryPrompt: 'Try:',
        initializing: 'Initializing...',
        creatingIndex: 'Creating document index...',
        generatingEmbeddings: 'Generating embeddings...',
        generatingSuggestions: 'Generating suggestions...',
        allSet: 'All set!',
        errorTitle: 'Application Error',
        tryAgain: 'Try Again',
        remove: 'Remove',
        send: 'Send',
        settings: 'Settings',
        removeFileConfirm: 'Are you sure you want to remove "{fileName}"? This will start a new chat session.',
        howToUse: 'How to Use',
        step1Title: 'Upload Your Documents',
        step1Desc: 'Drag and drop files or click "Browse Files" to select PDF, Word, Excel, or text documents from your computer.',
        step2Title: 'Start Chat Session',
        step2Desc: 'Click "Upload and Chat" to process your documents. The AI will analyze them and generate helpful question suggestions.',
        step3Title: 'Ask Questions',
        step3Desc: 'Type your questions or click on suggested questions. Get instant AI-powered answers with source citations from your documents.',
        step4Title: 'Customize & Manage',
        step4Desc: 'Use Settings to adjust accuracy mode, add more files during chat, or view/remove uploaded documents. Start a new chat anytime.',
        supportedFileTypes: 'Supported File Types',
        uploadDescription: 'Upload technical manuals, reports, safety documents, operational procedures, or any ONGC-related documentation.'
    },
    hi: {
        appTitle: 'ONGC दस्तावेज़ सहायक',
        appSubtitle: 'तकनीकी मैनुअल, सुरक्षा प्रक्रियाओं और परिचालन दस्तावेज़ों के लिए AI-संचालित बुद्धिमान खोज।',
        selectApiKey: 'शुरू करने के लिए Gemini API Key चुनें',
        apiKeySelected: '✓ API Key चयनित',
        dragDropText: 'अपनी फ़ाइलें यहाँ खींचें और छोड़ें।',
        browseFiles: 'या फ़ाइलें ब्राउज़ करें',
        selectedFiles: 'चयनित फ़ाइलें',
        uploadAndChat: 'अपलोड करें और चैट करें',
        tryExample: 'एक उदाहरण आज़माएं:',
        newChat: 'नई चैट',
        chatWith: 'चैट करें',
        askQuestion: 'दस्तावेज़ों के बारे में प्रश्न पूछें...',
        sources: 'स्रोत:',
        sourceText: 'स्रोत पाठ',
        close: 'बंद करें',
        tryPrompt: 'प्रयास करें:',
        initializing: 'आरंभ हो रहा है...',
        creatingIndex: 'दस्तावेज़ सूचकांक बनाया जा रहा है...',
        generatingEmbeddings: 'एम्बेडिंग उत्पन्न हो रहे हैं...',
        generatingSuggestions: 'सुझाव उत्पन्न हो रहे हैं...',
        allSet: 'सब तैयार है!',
        errorTitle: 'एप्लिकेशन त्रुटि',
        tryAgain: 'पुनः प्रयास करें',
        remove: 'हटाएं',
        send: 'भेजें',
        settings: 'सेटिंग्स',
        removeFileConfirm: 'क्या आप वाकई "{fileName}" को हटाना चाहते हैं? इससे एक नया चैट सत्र शुरू होगा।',
        howToUse: 'उपयोग कैसे करें',
        step1Title: 'अपने दस्तावेज़ अपलोड करें',
        step1Desc: 'फ़ाइलों को खींचें और छोड़ें या अपने कंप्यूटर से PDF, Word, Excel, या टेक्स्ट दस्तावेज़ चुनने के लिए "फ़ाइलें ब्राउज़ करें" पर क्लिक करें।',
        step2Title: 'चैट सत्र शुरू करें',
        step2Desc: 'अपने दस्तावेज़ों को प्रोसेस करने के लिए "अपलोड करें और चैट करें" पर क्लिक करें। AI उनका विश्लेषण करेगा और सहायक प्रश्न सुझाव उत्पन्न करेगा।',
        step3Title: 'प्रश्न पूछें',
        step3Desc: 'अपने प्रश्न टाइप करें या सुझाए गए प्रश्नों पर क्लिक करें। अपने दस्तावेज़ों से स्रोत उद्धरणों के साथ तत्काल AI-संचालित उत्तर प्राप्त करें।',
        step4Title: 'अनुकूलित करें और प्रबंधित करें',
        step4Desc: 'सटीकता मोड समायोजित करने, चैट के दौरान अधिक फ़ाइलें जोड़ने, या अपलोड किए गए दस्तावेज़ों को देखने/हटाने के लिए सेटिंग्स का उपयोग करें। कभी भी नई चैट शुरू करें।',
        supportedFileTypes: 'समर्थित फ़ाइल प्रकार',
        uploadDescription: 'तकनीकी मैनुअल, रिपोर्ट, सुरक्षा दस्तावेज़, परिचालन प्रक्रियाएं, या कोई भी ONGC-संबंधित दस्तावेज़ अपलोड करें।'
    }
};

export const getTranslation = (lang: Language): Translations => translations[lang];

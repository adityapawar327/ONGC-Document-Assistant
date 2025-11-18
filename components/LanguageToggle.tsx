/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useLanguage } from '../LanguageContext';

const LanguageToggle: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="language-toggle"
            title={language === 'en' ? 'Switch to Hindi' : 'अंग्रेज़ी में बदलें'}
            aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
        >
            {language === 'en' ? 'हिंदी' : 'English'}
        </button>
    );
};

export default LanguageToggle;

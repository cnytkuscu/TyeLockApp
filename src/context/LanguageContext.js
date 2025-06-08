import React, {createContext, useState, useContext} from 'react';
import localization from '../localization/localization.json';

export const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
  const [language, setLanguage] = useState('TR'); // default Türkçe

  const t = (key) => {
    return localization[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{language, setLanguage, t}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

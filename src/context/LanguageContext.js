import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localization from '../localization/localization.json';
 
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('TR');
 
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('preferredLanguage');
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        Alert.alert('Dil yüklenemedi', error.message);
      }
    };
    loadLanguage();
  }, []);
 
  const changeLanguage = async (lang) => {
    try {
      setLanguage(lang);
      await AsyncStorage.setItem('preferredLanguage', lang);
    } catch (error) {
      Alert.alert('Dil kaydedilemedi', error.message);
    }
  };
 
  const t = (key) => {
    return localization[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
 
export const useLanguage = () => useContext(LanguageContext);

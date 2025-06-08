import React, {createContext, useState, useEffect} from 'react';
import {useLanguage} from '../context/LanguageContext';

export const BluetoothContext = createContext();

export const BluetoothProvider = ({children}) => {
  const {t} = useLanguage();

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setStatus(t('not_connected'));
  }, [t]); // dil değişince tetiklenir

  return (
    <BluetoothContext.Provider
      value={{status, setStatus, selectedDevice, setSelectedDevice}}>
      {children}
    </BluetoothContext.Provider>
  );
};

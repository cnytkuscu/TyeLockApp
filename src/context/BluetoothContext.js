import React, {createContext, useState} from 'react';
import {useLanguage} from '../context/LanguageContext';
export const BluetoothContext = createContext();

export const BluetoothProvider = ({children}) => {
  const {language, setLanguage, t} = useLanguage();
  const [status, setStatus] = useState(t('not_connected'));
  const [selectedDevice, setSelectedDevice] = useState(null);

  return (
    <BluetoothContext.Provider
      value={{status, setStatus, selectedDevice, setSelectedDevice}}>
      {children}
    </BluetoothContext.Provider>
  );
};

import React, {createContext, useState, useEffect} from 'react';
import {useLanguage} from '../context/LanguageContext';

export const BluetoothContext = createContext();
export const BluetoothProvider = ({children}) => {
  const {t} = useLanguage();

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [status, setStatus] = useState(t('not_connected'));
  const [writeCharacteristic, setWriteCharacteristic] = useState(null); // ✅ EKLENDİ

  return (
    <BluetoothContext.Provider
      value={{
        status,
        setStatus,
        selectedDevice,
        setSelectedDevice,
        writeCharacteristic,
        setWriteCharacteristic, // ✅ EKLENDİ
      }}>
      {children}
    </BluetoothContext.Provider>
  );
};

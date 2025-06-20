import React, { createContext, useState, useMemo } from 'react';

export const WifiContext = createContext();

export const WifiProvider = ({ children }) => {
  const [wifiList, setWifiList] = useState([]);
  const [selectedSSID, setSelectedSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  const value = useMemo(() => ({
    wifiList,
    setWifiList,
    selectedSSID,
    setSelectedSSID,
    wifiPassword,
    setWifiPassword,
  }), [wifiList, selectedSSID, wifiPassword]);

  return (
    <WifiContext.Provider value={value}>
      {children}
    </WifiContext.Provider>
  );
};

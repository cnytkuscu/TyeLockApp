import React, { createContext, useState } from 'react';

export const WifiContext = createContext();

export const WifiProvider = ({ children }) => {
  const [wifiList, setWifiList] = useState([]);
  const [selectedSSID, setSelectedSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  const value = {
    wifiList,
    setWifiList,
    selectedSSID,
    setSelectedSSID,
    wifiPassword,
    setWifiPassword,
  };

  return (
    <WifiContext.Provider value={value}>
      <>{children}</>
    </WifiContext.Provider>
  );
};

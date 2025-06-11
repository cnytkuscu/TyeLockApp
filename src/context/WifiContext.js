import React, { createContext, useState } from 'react';

export const WifiContext = createContext();

export const WifiProvider = ({ children }) => {
  const [wifiList, setWifiList] = useState([]);
  const [selectedSSID, setSelectedSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  return (
    <WifiContext.Provider
      value={{
        wifiList,
        setWifiList,
        selectedSSID,
        setSelectedSSID,
        wifiPassword,
        setWifiPassword,
      }}>
      {children}
    </WifiContext.Provider>
  );
};

import React, {createContext, useState} from 'react';

export const BluetoothContext = createContext();

export const BluetoothProvider = ({children}) => {
  const [status, setStatus] = useState('Not Connected');
  const [selectedDevice, setSelectedDevice] = useState(null);

  return (
    <BluetoothContext.Provider
      value={{status, setStatus, selectedDevice, setSelectedDevice}}>
      {children}
    </BluetoothContext.Provider>
  );
};

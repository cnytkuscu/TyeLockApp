import React, {createContext, useState, useMemo} from 'react';

export const BluetoothContext = createContext();

export const BluetoothProvider = ({children}) => {
  const [status, setStatus] = useState('not_connected');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [writeCharacteristic, setWriteCharacteristic] = useState(null);

  const value = useMemo(
    () => ({
      status,
      setStatus,
      selectedDevice,
      setSelectedDevice,
      writeCharacteristic,
      setWriteCharacteristic,
    }),
    [status, selectedDevice, writeCharacteristic],
  );

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};

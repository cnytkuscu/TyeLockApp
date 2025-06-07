// src/components/BluetoothScanner.js
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

const manager = new BleManager();

const BluetoothScanner = ({onDeviceSelect, isConnected}) => {
  const [devices, setDevices] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isConnected) {
      startScanningLoop();
    }

    return () => {
      stopScanningLoop();
    };
  }, [isConnected]);

  const startScanningLoop = () => {
    intervalRef.current = setInterval(() => {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('Tarama hatası:', error.message);
          return;
        }

        if (device?.name) {
          setDevices(prev => {
            const exists = prev.find(d => d.id === device.id);
            return exists ? prev : [...prev, device];
          });
        }
      });

      setTimeout(() => {
        manager.stopDeviceScan();
      }, 4000); // her döngüde 4 saniye tarasın
    }, 5000);
  };

  const stopScanningLoop = () => {
    manager.stopDeviceScan();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yakındaki Bluetooth Cihazları</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => onDeviceSelect(item)}>
            <Text style={styles.deviceName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginTop: 10},
  title: {fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 10},
  deviceItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  deviceName: {color: '#000'},
});

export default BluetoothScanner;

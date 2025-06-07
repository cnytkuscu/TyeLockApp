import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

const manager = new BleManager();


const BluetoothScanner = ({
  onDeviceSelect,
  isConnected,
  isConnecting,
  setIsConnecting,
  connectingDeviceId,
  setConnectingDeviceId,
}) => {
  const [devices, setDevices] = useState([]);
  const intervalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setIsLoading(true); // loading başlasın
      startScanningLoop();
    }

    return () => {
      stopScanningLoop();
    };
  }, [isConnected]);

  const startScanningLoop = () => {
    intervalRef.current = setInterval(() => {
      console.log('🔄 Yeni tarama döngüsü başlatıldı');

      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('Tarama hatası:', error.message);
          return;
        }

        if (device?.name) {
          console.log('Cihaz bulundu:', device.name);

          setDevices(prev => {
            const exists = prev.find(d => d.id === device.id);
            return exists ? prev : [...prev, device];
          });
        }
      });

      // 4 saniye tarayıp durdur
      setTimeout(() => {
        console.log('🛑 Tarama durduruldu');
        manager.stopDeviceScan();
        setIsLoading(false);
      }, 4000);
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
      <Text style={styles.title}>Nearby Bluetooth Devices</Text>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#ffffff"
          style={{marginBottom: 15}}
        />
      ) : devices.length === 0 ? (
        <Text style={{color: '#ccc', marginTop: 10}}>No Device found.</Text>
      ) : null}

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => {
              setIsConnecting(true);
              setConnectingDeviceId(item.id);
              onDeviceSelect(item);
            }}
            disabled={isConnecting} // bağlantı sırasında tıklamayı engelle
          >
            <Text style={styles.deviceName}>
              {isConnecting && connectingDeviceId === item.id
                ? 'Connecting...'
                : item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isConnecting && (
        <ActivityIndicator
          size="large"
          color="#ffffff"
          style={{marginTop: 10}}
        />
      )}
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

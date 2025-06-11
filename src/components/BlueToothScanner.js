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

import {useLanguage} from '../context/LanguageContext';

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
  const {language, setLanguage, t} = useLanguage();

  useEffect(() => {
    if (!isConnected) {
      setIsLoading(true);
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
      <Text style={styles.title}>{t('nearby_bluetooth_devices')}</Text>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#ffffff"
          style={{marginBottom: 15}}
        />
      ) : devices.length === 0 ? (
        <Text style={{color: '#ccc', marginTop: 10}}>
          {t('no_device_found')}
        </Text>
      ) : null}

      <View style={styles.listContainer}>
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
              disabled={isConnecting}>
              <Text style={styles.deviceName}>
                {isConnecting && connectingDeviceId === item.id
                  ? t('connecting')
                  : item.name}
              </Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={true}
        />
      </View>

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
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    maxHeight: 140,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  listContainer: {
     flexGrow: 1, // burada flex:1 veriyoruz ki alan büyüsün, FlatList içeriği uzadıkça
    marginBottom: 10, // opsiyonel, alt boşluk için
  },
  deviceItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceName: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BluetoothScanner;

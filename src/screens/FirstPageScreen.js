import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {BleManager, State} from 'react-native-ble-plx';
import {Alert} from 'react-native';

import styles from '../styles/FirstPageStyles';
import BluetoothScanner from '../components/BlueToothScanner';

const FirstPage = () => {
  const navigation = useNavigation();
  const [status, setStatus] = useState('Not Connected');
  const [isExpanded, setIsExpanded] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const manager = new BleManager();


  const handleConnectPress = async () => {
  try {
    const bluetoothState = await manager.state();

    if (bluetoothState !== State.PoweredOn) {
      Alert.alert(
        'Bluetooth Kapalı',
        'Lütfen Bluetooth’u açarak tekrar deneyin.'
      );
      return;
    }

    setIsExpanded(true);
  } catch (error) {
    console.error('Bluetooth durumu kontrolünde hata:', error);
    Alert.alert('Hata', 'Bluetooth kontrolü sırasında bir sorun oluştu.');
  }
};


  return (
    <View style={styles.container}>
      <LottieView
        source={require('../lotties/landingPageLottie.json')}
        autoPlay
        loop
        style={{
          width: '100%',
          height: '120%',
          position: 'absolute',
        }}
        resizeMode="cover"
      />
      <View style={[styles.connectionStatusCard, isExpanded && {height: 300}]}>
        <Text style={styles.statusTitle}>TyeLock Connection Status</Text>
        <Text style={styles.statusText}>{status}</Text>

        {status !== 'Connected' && (
          <TouchableOpacity style={styles.button} onPress={handleConnectPress}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        )}

        {isExpanded && (
          <BluetoothScanner
            isConnected={status === 'Connected'}
            onDeviceSelect={device => {
              setSelectedDevice(device);
              setStatus('Connected');
              setIsExpanded(false);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default FirstPage;

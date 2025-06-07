import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {BleManager, State} from 'react-native-ble-plx';
import Icon from 'react-native-vector-icons/Ionicons';
 

import styles from '../styles/FirstPageStyles';
import BluetoothScanner from '../components/BlueToothScanner';
import {BluetoothContext} from '../context/BluetoothContext';

const FirstPage = () => {
  const {status, setStatus, selectedDevice, setSelectedDevice} =
    useContext(BluetoothContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const manager = new BleManager();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState(null);

  const handleConnectPress = async () => {
    try {
      const bluetoothState = await manager.state();
      if (bluetoothState !== State.PoweredOn) {
        Alert.alert(
          'Bluetooth is Off',
          'Please try again while your Bluetooth is On.',
        );
        return;
      }

      setIsExpanded(true);
    } catch (error) {
      Alert.alert('Hata', 'Bluetooth kontrolü sırasında bir sorun oluştu.');
    }
  };

  const connectToDevice = async device => {
    try {
      setIsConnecting(true); // başla
      const connectedDevice = await manager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();

      setSelectedDevice(connectedDevice);
      setStatus('Connected');
      setIsExpanded(false);
      manager.stopDeviceScan();
      Alert.alert('Successfully Connected', `Connected to ${device.name}`);
    } catch (error) {
      Alert.alert('Connection Error', "Couldn't Connect to Device.", [
        {text: 'OK'},
      ]);
    } finally {
      setIsConnecting(false);
      setConnectingDeviceId(null);
    }
  };

  const disconnectDevice = () => {
    Alert.alert('Disconnect Device', 'Would you like to disconnect ?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Yes',
        onPress: async () => {
          try {
            if (selectedDevice) {
              await manager.cancelDeviceConnection(selectedDevice.id);
            }
            setStatus('Not Connected');
            setSelectedDevice(null);
          } catch (error) {
            Alert.alert('Hata', 'Bağlantı kesilirken bir sorun oluştu.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../lotties/landingPageLottie.json')}
        autoPlay
        loop
        style={{
          width: '100%',
          height: '125%',
          position: 'absolute',
        }}
        resizeMode="cover"
      />
      <View style={[styles.connectionStatusCard, isExpanded && {height: 300}]}>
        <Text style={styles.statusTitle}>TyeLock Connection Status</Text>

        {status === 'Connected' && selectedDevice ? (
          <View style={styles.connectedRow}>
            <Text style={styles.statusText}>
              Connected: {selectedDevice.name || 'Unknown'}
            </Text>
            <TouchableOpacity
              onPress={disconnectDevice}
              style={styles.disconnectBtn}>
              <Icon name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.statusText}>{status}</Text>
        )}

        {status !== 'Connected' && (
          <TouchableOpacity style={styles.button} onPress={handleConnectPress}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        )}

        {isExpanded && (
          <BluetoothScanner
            isConnected={status === 'Connected'}
            isConnecting={isConnecting}
            setIsConnecting={setIsConnecting}
            connectingDeviceId={connectingDeviceId}
            setConnectingDeviceId={setConnectingDeviceId}
            onDeviceSelect={device => connectToDevice(device)}
          />
        )}

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={{marginTop: 10}}
          />
        )}
      </View>
    </View>
  );
};

export default FirstPage;

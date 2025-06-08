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
import {useLanguage} from '../context/LanguageContext';

const FirstPage = () => {
  const {status, setStatus, selectedDevice, setSelectedDevice} =
    useContext(BluetoothContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const manager = new BleManager();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState(null);
  const {language, setLanguage, t} = useLanguage();

  const handleConnectPress = async () => {
    try {
      const bluetoothState = await manager.state();
      if (bluetoothState !== State.PoweredOn) {
        Alert.alert(
          t('bluetooth_off_alert_title'),
          t('bluetooth_off_alert_message'),
        );
        return;
      }

      setIsExpanded(true);
    } catch (error) {
      Alert.alert(t('error_happened'), t('bluetooth_control_error'));
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
      Alert.alert(
        t('successfully_connected'),
        `${t('connected_to')} ${device.name}`,
      );
    } catch (error) {
      Alert.alert(t('connection_error'), t('couldnt_connect_to_device'), [
        {text: 'OK'},
      ]);
    } finally {
      setIsConnecting(false);
      setConnectingDeviceId(null);
    }
  };

  const disconnectDevice = () => {
    Alert.alert(t('disconnect_device'), t('sure_disconnect_device'), [
      {text: t('cancel'), style: 'cancel'},
      {
        text: t('yes'),
        onPress: async () => {
          try {
            if (selectedDevice) {
              await manager.cancelDeviceConnection(selectedDevice.id);
            }
            setStatus('Not Connected');
            setSelectedDevice(null);
          } catch (error) {
            Alert.alert(t('error_happened'), t('error_on_disconnecting'));
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
        <Text style={styles.statusTitle}>{t('connection_status')}</Text>

        {status === 'Connected' && selectedDevice ? (
          <View style={styles.connectedContainer}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>
                {t('connected_to')}
                {selectedDevice.name || t('unknown_device')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={disconnectDevice}
              style={styles.disconnectBtn}>
              <Icon name="close-circle" size={28} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.statusText}>{status}</Text>
        )}

        {status !== 'Connected' && (
          <TouchableOpacity style={styles.button} onPress={handleConnectPress}>
            <Text style={styles.buttonText}>{t('scan')}</Text>
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

import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {BleManager, State} from 'react-native-ble-plx';
import Icon from 'react-native-vector-icons/Ionicons';
import base64 from 'react-native-base64';

import styles from '../styles/DashboardStyles';
import BluetoothScanner from '../components/BlueToothScanner';
import {BluetoothContext} from '../context/BluetoothContext';
import {useLanguage} from '../context/LanguageContext';

import {useEffect} from 'react';
import {WifiContext} from '../context/WifiContext';

const Dashboard = () => {
  const {status, setStatus, selectedDevice, setSelectedDevice} =
    useContext(BluetoothContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const manager = new BleManager();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState(null);
  const [writableCharacteristic, setWritableCharacteristic] = useState(null);
  const {t} = useLanguage();
  const {
    wifiList,
    setWifiList,
    selectedSSID,
    setSelectedSSID,
    wifiPassword,
    setWifiPassword,
  } = useContext(WifiContext);
  const [isTurnOnActive, setIsTurnOnActive] = useState(false);

  const handleBTCommand = command => {
    sendBTCommand(command);

    if (command === 'TurnOn') {
      setIsTurnOnActive(true);
    } else if (command === 'TurnOff') {
      setIsTurnOnActive(false);
    }
  };

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
      setIsConnecting(true);
      console.log('🔌 Connecting to device...');
      const connectedDevice = await manager.connectToDevice(device.id);
      console.log('✅ Connected to device:', connectedDevice.id);

      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('🔍 Services discovered');

      const services = await connectedDevice.services();
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const char of characteristics) {
          if (char.isWritableWithResponse) {
            console.log('🖋️ Found writable characteristic:', char.uuid);
            setWritableCharacteristic(char);
            break;
          }
        }
      }

      setSelectedDevice(connectedDevice);
      setStatus(t('connected'));
      setIsExpanded(false);
      manager.stopDeviceScan();

      Alert.alert(
        t('successfully_connected'),
        `${t('connected_to')} ${device.name}`,
      );
    } catch (error) {
      console.log('❌ Connection error:', error);
      Alert.alert(t('connection_error'), t('couldnt_connect_to_device'));
    } finally {
      setIsConnecting(false);
      setConnectingDeviceId(null);
    }

    manager.monitorDeviceConnection(device.id, (error, disconnectedDevice) => {
      if (error) {
        console.log('⚠️ Monitor error:', error);
        return;
      }

      if (!disconnectedDevice) {
        console.log('🔌 Device disconnected unexpectedly');
        setStatus(t('not_connected'));
        setSelectedDevice(null);
      }
    });
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
            setStatus(t('not_connected'));
            setSelectedDevice(null);
            setWritableCharacteristic(null);
          } catch (error) {
            Alert.alert(t('error_happened'), t('error_on_disconnecting'));
          }
        },
      },
    ]);
  };

  const sendBTCommand = async color => {
    if (!writableCharacteristic) {
      Alert.alert(t('error_happened'), t('no_writable_characteristic_found'));
      return;
    }

    try {
      await writableCharacteristic.writeWithResponse(base64.encode(color));
    } catch (error) {
      Alert.alert(t('error_happened'), t('couldnt_send_data'));
    }
  };

  useEffect(() => {
    if (!selectedDevice) return;

    const setupNotification = async () => {
      const services = await selectedDevice.services();
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const char of characteristics) {
          if (char.isNotifiable) {
            console.log('🔔 Found notifiable characteristic:', char.uuid);

            char.monitor((error, characteristic) => {
              if (error) {
                console.log('❌ Notification error:', error);
                return;
              }

              const base64Value = characteristic?.value;
              if (!base64Value) return;

              try {
                const decoded = base64.decode(base64Value);
                console.log('📶 Notify received:', decoded);

                const jsonData = JSON.parse(decoded);

                if (Array.isArray(jsonData.networks)) {
                  setWifiList(jsonData.networks);
                }
              } catch (err) {
                console.log('❌ JSON parse error:', err.message);
              }
            });

            return;
          }
        }
      }
    };

    setupNotification();
  }, [selectedDevice]);

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

      {/* Bağlantı Kutusu */}
      <View style={[styles.connectionStatusCard, isExpanded && {height: 300}]}>
        <Text style={styles.statusTitle}>{t('connection_status')}</Text>

        {status === t('connected') && selectedDevice ? (
          <View style={styles.connectedContainer}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>
                {t('connected_to')} {selectedDevice.name || t('unknown_device')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={disconnectDevice}
              style={styles.disconnectBtn}>
              <Icon name="close-circle" size={28} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.statusText}>{t('not_connected')}</Text>
        )}

        {status !== t('connected') && (
          <TouchableOpacity style={styles.button} onPress={handleConnectPress}>
            <Text style={styles.buttonText}>{t('scan')}</Text>
          </TouchableOpacity>
        )}

        {isExpanded && (
          <BluetoothScanner
            isConnected={status === t('connected')}
            isConnecting={isConnecting}
            setIsConnecting={setIsConnecting}
            connectingDeviceId={connectingDeviceId}
            setConnectingDeviceId={setConnectingDeviceId}
            onDeviceSelect={device => connectToDevice(device)}
          />
        )}
      </View>

      {status === t('connected') && (
        <View style={styles.deviceControlCard}>
          <Text style={styles.statusTitle}>{t('send_bt_command')}</Text>
          <View style={styles.colorButtonRow}>
            <TouchableOpacity
              style={[
                styles.colorButton,
                {
                  backgroundColor: isTurnOnActive
                    ? 'rgba(16, 147, 203, 0.5)'
                    : 'rgba(16, 147, 203, 1)',
                },
              ]}
              disabled={isTurnOnActive}
              onPress={() => handleBTCommand('TurnOn')}>
              <Text style={styles.colorButtonText}>TurnOn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.colorButton,
                {
                  backgroundColor: isTurnOnActive
                    ? 'rgba(16, 147, 203, 1)'
                    : 'rgba(16, 147, 203, 0.5)',
                },
              ]}
              disabled={!isTurnOnActive}
              onPress={() => handleBTCommand('TurnOff')}>
              <Text style={styles.colorButtonText}>TurnOff</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.colorButton,
                {backgroundColor: 'rgba(16, 147, 203, 1)'},
              ]}
              onPress={() => sendBTCommand('scan_wifi')}>
              <Text style={styles.colorButtonText}>Wi-Fi Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {wifiList.length > 0 && (
        <View style={styles.wifiListCard}>
          <Text style={styles.statusTitle}>{t('available_networks')}</Text>

          {wifiList.map((ssid, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.wifiItem,
                selectedSSID === ssid && {backgroundColor: 'rgba(0,0,0,0.2)'},
              ]}
              onPress={() => setSelectedSSID(ssid)}>
              <Text style={styles.wifiText}>{ssid}</Text>
            </TouchableOpacity>
          ))}

          {selectedSSID !== '' && (
            <View style={{marginTop: 10}}>
              <Text style={styles.wifiText}>
                {t('enter_password_for')} "{selectedSSID}"
              </Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={wifiPassword}
                onChangeText={setWifiPassword}
                placeholder={t('wifi_password')}
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  if (!writableCharacteristic) return;

                  const payload = JSON.stringify({
                    ssid: selectedSSID,
                    password: wifiPassword,
                  });

                  writableCharacteristic.writeWithResponse(
                    base64.encode(payload),
                  );

                  Alert.alert(t('sent'), t('wifi_info_sent'));
                }}>
                <Text style={styles.buttonText}>{t('send')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Dashboard;

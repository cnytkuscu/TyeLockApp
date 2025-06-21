import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {BleManager, State} from 'react-native-ble-plx';
import Icon from 'react-native-vector-icons/Ionicons';
import base64 from 'react-native-base64';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import styles from '../styles/DashboardStyles';
import BluetoothScanner from '../components/BlueToothScanner';
import TimePicker from '../components/TimePicker';
import {BluetoothContext} from '../context/BluetoothContext';
import {useLanguage} from '../context/LanguageContext';
import {WifiContext} from '../context/WifiContext';

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const manager = new BleManager();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState(null);
  const [writableCharacteristic, setWritableCharacteristic] = useState(null);
  const {t} = useLanguage();

  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [hour, setHour] = useState(new Date().getHours());
  const [minute, setMinute] = useState(new Date().getMinutes());
  const [second, setSecond] = useState(new Date().getSeconds());

  const timeoutRef = useRef(null);
  const refTime = useRef(new Date());

  useEffect(() => {
    if (!autoUpdateEnabled) return;

    const interval = setInterval(() => {
      // refTime'ı 1 saniye ileri al
      refTime.current = new Date(refTime.current.getTime() + 1000);

      setHour(refTime.current.getHours());
      setMinute(refTime.current.getMinutes());
      setSecond(refTime.current.getSeconds());
    }, 1000);

    return () => clearInterval(interval);
  }, [autoUpdateEnabled]);

  // Elle değişiklik yapıldığında çağrılacak fonksiyon
  const handleManualTimeChange = (type, val) => {
    setAutoUpdateEnabled(false);

    const currentRefDate = new Date(refTime.current);

    if (type === 'hour') currentRefDate.setHours(val);
    else if (type === 'minute') currentRefDate.setMinutes(val);
    else if (type === 'second') currentRefDate.setSeconds(val);

    refTime.current = currentRefDate;

    setHour(currentRefDate.getHours());
    setMinute(currentRefDate.getMinutes());
    setSecond(currentRefDate.getSeconds());

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      sendBTCommand('set_time_at_the_beginning', [
        refTime.current.getHours(),
        refTime.current.getMinutes(),
        refTime.current.getSeconds(),
      ]);
      setAutoUpdateEnabled(true);
    }, 2000);
  };

  const {
    status,
    setStatus,
    selectedDevice,
    setSelectedDevice,
    writeCharacteristic,
    setWriteCharacteristic,
  } = useContext(BluetoothContext);

  const {
    wifiList,
    setWifiList,
    selectedSSID,
    setSelectedSSID,
    connectedSSID,
    setConnectedSSID,
    wifiPassword,
    setWifiPassword,
  } = useContext(WifiContext);

  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const [isTurnOnActive, setIsTurnOnActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isWifiConnected, setIsWifiConnected] = useState(false);

  function convertCommandToJson(command, data = []) {
    return JSON.stringify({
      command,
      data,
    });
  }

  const sendBTCommand = async (command, data = []) => {
    if (!writableCharacteristic) {
      Alert.alert(t('error_happened'), t('no_writable_characteristic_found'));
      return;
    }

    try {
      const jsonString = convertCommandToJson(command, data);
      const base64Data = base64.encode(jsonString);
      console.log('📤 Gönderilen komut:', command, ' - ', jsonString);
      await writableCharacteristic.writeWithResponse(base64Data);
    } catch (error) {
      Alert.alert(t('error_happened'), t('couldnt_send_data'));
    }
  };

  const handleBTCommand = command => {
    sendBTCommand(command);

    if (command === 'TurnOn') {
      setIsTurnOnActive(true);
    } else if (command === 'TurnOff') {
      setIsTurnOnActive(false);
    }
  };

  const sendCurrentTimeToESP32 = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    sendBTCommand('set_time_at_the_beginning', [hours, minutes, seconds]);
    sendBTCommand('get_led_status');
    sendBTCommand('wifi_status');
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

      const services = await connectedDevice.services();
      console.log('🔍 Services discovered');
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
      Alert.alert(t('connection_error'), t('couldnt_connect_to_device'));
    } finally {
      setIsConnecting(false);
      setConnectingDeviceId(null);
    }

    manager.monitorDeviceConnection(device.id, (error, disconnectedDevice) => {
      if (error) return;

      if (!disconnectedDevice) {
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
            setIsWifiConnected(false);
            setWifiList([]);
          } catch {
            Alert.alert(t('error_happened'), t('error_on_disconnecting'));
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (writableCharacteristic) {
      sendCurrentTimeToESP32();
    }
  }, [writableCharacteristic]);

  useEffect(() => {
    if (!selectedDevice) return;

    const setupNotification = async () => {
      const services = await selectedDevice.services();
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const char of characteristics) {
          if (char.isNotifiable) {
            char.monitor((error, characteristic) => {
              if (error) return;

              const base64Value = characteristic?.value;
              if (!base64Value) return;

              try {
                const decoded = base64.decode(base64Value);
                const jsonData = JSON.parse(decoded);
                console.log("ESP32'den Gelen Veri : ", decoded);
                if (Array.isArray(jsonData.networks)) {
                  setWifiList(jsonData.networks);
                }
                if (jsonData.command === 'initial_led_status') {
                  setIsTurnOnActive(jsonData.data);
                }
                if (jsonData.command === 'wifi_connection_result') {
                  setIsWifiConnected(jsonData.data);
                }
                if (jsonData.command === 'wifi_status') {
                  try {
                    const dataArray = JSON.parse(jsonData.data);
                    const [isConnected, ssid] = dataArray;
                    setIsWifiConnected(isConnected);
                    setConnectedSSID(ssid);
                    setSelectedSSID(ssid);
                  } catch (e) {
                    console.warn('Data parse hatası', e);
                  }
                }
              } catch (err) {
                console.warn('⚠️ JSON parse hatası:', err.message);
              }
            });
            return;
          }
        }
      }
    };

    setupNotification();
  }, [selectedDevice]);

  const bleManager = new BleManager();
  useEffect(() => {
    if (!selectedDevice) return;

    const intervalId = setInterval(async () => {
      try {
        const connected = await bleManager.isDeviceConnected(selectedDevice.id);
        if (!connected) {
          setStatus(t('not_connected'));
          setSelectedDevice(null);
          setIsWifiConnected(false);
          setWifiList([]);
        }
      } catch (error) {
        console.error('🔌 Bağlantı kontrol hatası:', error);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [selectedDevice]);

  const handleSSIDPress = ssid => {
    setSelectedSSID(ssid);
    setWifiPassword('');
    setModalVisible(true);
  };

  const handleSendWifiConfig = () => {
    if (!writableCharacteristic) {
      Alert.alert(t('error_happened'), t('no_writable_characteristic_found'));
      return;
    }

    if (!selectedSSID || !wifiPassword) {
      Alert.alert(t('error_happened'), t('please_enter_password'));
      return;
    }

    const payload = JSON.stringify({
      command: 'connect_to_wifi',
      data: [selectedSSID, wifiPassword],
    });

    writableCharacteristic
      .writeWithResponse(base64.encode(payload))
      .then(() => {
        Alert.alert(t('sent'), t('wifi_info_sent'));
        setModalVisible(false);
        setWifiPassword('');
        setWifiList([]);
      })
      .catch(() => {
        setWifiList([]);
        Alert.alert(t('error_happened'), t('couldnt_send_data'));
      });
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
          top: -20,
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

              {/* ✅ Bağlanılan WiFi Ağı */}
              {isWifiConnected && connectedSSID && (
                <View style={{marginTop: 10}}>
                  <Text style={styles.deviceName}>
                    {t('connected_network')} {connectedSSID}
                  </Text>
                </View>
              )}
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
                  backgroundColor: !isTurnOnActive
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0)',
                },
              ]}
              disabled={isTurnOnActive}
              onPress={() => handleBTCommand('TurnOn')}>
              <Text style={styles.colorButtonText}>{t('turn_on')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.colorButton,
                {
                  backgroundColor: isTurnOnActive
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0)',
                },
              ]}
              disabled={!isTurnOnActive}
              onPress={() => handleBTCommand('TurnOff')}>
              <Text style={styles.colorButtonText}>{t('turn_off')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.colorButton,
                {
                  backgroundColor:
                    wifiList.length > 0
                      ? 'rgba(255,255,255,0)'
                      : 'rgba(255,255,255,0.1)',
                },
              ]}
              onPress={() => handleBTCommand('scan_wifi')}
              disabled={wifiList.length > 0} // Liste varsa buton disable
            >
              <Text style={styles.colorButtonText}>{t('scan_wifi')}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center', // Dikey ortalama
              marginTop: 20,
            }}>
            <TimePicker
              label={t('hour')}
              maxValue={23}
              value={hour}
              onChange={val => handleManualTimeChange('hour', val)}
            />
            <TimePicker
              label={t('minute')}
              maxValue={59}
              value={minute}
              onChange={val => handleManualTimeChange('minute', val)}
            />
            <TimePicker
              label={t('second')}
              maxValue={59}
              value={second}
              onChange={val => handleManualTimeChange('second', val)}
            />

            {/* Kompakt Refresh Butonu */}
            <TouchableOpacity
              style={{
                marginLeft: 12,
                paddingVertical: 8,
                paddingHorizontal: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                minWidth: 60,
              }}
              onLongPress={() => {
                ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }
                const now = new Date();
                refTime.current = now;
                setHour(now.getHours());
                setMinute(now.getMinutes());
                setSecond(now.getSeconds());
                sendBTCommand('set_time_at_the_beginning', [
                  now.getHours(),
                  now.getMinutes(),
                  now.getSeconds(),
                ]);
                setAutoUpdateEnabled(true);
              }}
              delayLongPress={500}>
              <Icon name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* WiFi Listesi */}
      {wifiList.length > 0 && (
        <View style={styles.wifiListCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.statusTitle}>{t('available_networks')}</Text>

            <TouchableOpacity
              onPress={() => setWifiList([])}
              style={{padding: 5, marginRight: 5}}>
              <Icon name="close-circle" size={28} color="#ff4d4d" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={wifiList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.wifiItem,
                  selectedSSID === item && {backgroundColor: 'rgba(0,0,0,0.2)'},
                ]}
                onPress={() => handleSSIDPress(item)}>
                <Text style={styles.wifiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Sifre Giris Ekrani */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.statusTitle}>{selectedSSID}</Text>

            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder={t('wifi_password')}
              placeholderTextColor="#999"
              value={wifiPassword}
              onChangeText={setWifiPassword}
              autoFocus
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Pressable
                style={[
                  styles.button,
                  {
                    flex: 1,
                    marginRight: 10,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                ]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>{t('cancel')}</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.button,
                  {
                    flex: 1,
                    marginRight: 10,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                ]}
                onPress={handleSendWifiConfig}>
                <Text style={styles.buttonText}>{t('send')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;

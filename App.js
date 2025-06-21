import React, {useEffect} from 'react'; // <-- useEffect burada tanımlı olmalı
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Orientation from 'react-native-orientation-locker';

import WelcomeScreen from './src/screens/WelcomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';

import {BluetoothProvider} from './src/context/BluetoothContext';
import {WifiProvider} from './src/context/WifiContext';
import {LanguageProvider} from './src/context/LanguageContext';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait(); // sadece dikey mod
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BluetoothProvider>
        <WifiProvider>
          <LanguageProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen
                  name="Dashboard"
                  component={DashboardScreen}
                  options={{unmountOnBlur: false}}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </LanguageProvider>
        </WifiProvider>
      </BluetoothProvider>
    </GestureHandlerRootView>
  );
};

export default App;

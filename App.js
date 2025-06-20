import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';

import { BluetoothProvider } from './src/context/BluetoothContext';
import { WifiProvider } from './src/context/WifiContext';
import { LanguageProvider } from './src/context/LanguageContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* LanguageProvider EN DIŞTA TUTULDU */}
      <BluetoothProvider>
        <WifiProvider>
          <LanguageProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen
                  name="Dashboard"
                  component={DashboardScreen}
                  options={{ unmountOnBlur: false }}
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

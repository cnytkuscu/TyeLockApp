import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import Dashboard from './src/screens/DashboardScreen';

import { BluetoothProvider } from './src/context/BluetoothContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { WifiProvider } from './src/context/WifiContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <BluetoothProvider>
          <WifiProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
              </Stack.Navigator>
            </NavigationContainer>
          </WifiProvider>
        </BluetoothProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
};

export default App;

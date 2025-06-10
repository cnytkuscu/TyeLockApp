import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import Dashboard from './src/screens/DashboardScreen';

import {BluetoothProvider} from './src/context/BluetoothContext';
import {LanguageProvider} from './src/context/LanguageContext';

const Stack = createNativeStackNavigator();

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'instanceHandle is null',
  'Warning: ...',
]);
const App = () => {
  return (
    <LanguageProvider>
      <BluetoothProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{gestureEnabled: true}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BluetoothProvider>
    </LanguageProvider>
  );
};

export default App;

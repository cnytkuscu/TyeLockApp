import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import FirstPage from './src/screens/FirstPageScreen';

import {BluetoothProvider} from './src/context/BluetoothContext';
import {LanguageProvider} from './src/context/LanguageContext'; // <-- Ekledik

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <LanguageProvider>
      <BluetoothProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen
              name="FirstPage"
              component={FirstPage}
              options={{gestureEnabled: true}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BluetoothProvider>
    </LanguageProvider>
  );
};

export default App;

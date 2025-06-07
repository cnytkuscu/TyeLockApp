import React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import styles from '../styles/WelcomePageStyles';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('FirstPage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LottieView
        source={require('../lotties/landingPageLottie.json')}
        autoPlay
        loop
        style={{
          width: '100%',
          height: '120%',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom:0,
          right : 0
        }}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
          <Text style={styles.title}>TyeLock ile Harika bir Serüvene Hazır mısın?</Text>
          
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Giriş</Text>
          </TouchableOpacity>
        </View> 
    </SafeAreaView>
  );
};

export default WelcomeScreen;

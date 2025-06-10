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

import {useLanguage} from '../context/LanguageContext';  

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const {language, setLanguage, t} = useLanguage();  

  const handlePress = () => {
    navigation.navigate('Dashboard');
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
          bottom: 0,
          right: 0,
        }}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{t('welcome_title')}</Text>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>{t('welcome_button')}</Text>
        </TouchableOpacity>

        {/* Dil Seçimi Butonları */}
        <View style={styles.languageButtons}>
          <TouchableOpacity
            style={[
              styles.langButton,
              language === 'TR' && styles.langButtonSelected,
            ]}
            onPress={() => setLanguage('TR')}>
            <Text style={styles.langButtonText}>🇹🇷</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.langButton,
              language === 'EN' && styles.langButtonSelected,
            ]}
            onPress={() => setLanguage('EN')}>
            <Text style={styles.langButtonText}>🇬🇧</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

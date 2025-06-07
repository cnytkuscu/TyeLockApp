import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/FirstPageStyles';

const FirstPage = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack(); // önceki sayfaya geri dön
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hoş geldin! Burası FirstPage 🎉</Text>

      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>◀ Geri</Text>
      </TouchableOpacity>
    </View>
  );
};


export default FirstPage;
 

import { StyleSheet, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');

const welcomePageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Yedek renk
  },
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  title: {
  fontSize: 32, // Daha büyük
  fontWeight: 'bold', // Kalınlaştır
  color: '#FFFFFF', // Beyaz veya pastel uyumlu bir ton
  textAlign: 'center',
  marginBottom: 40,
  textShadowColor: 'rgba(0, 0, 0, 0.3)', // Hafif gölge efekti
  textShadowOffset: { width: 1, height: 2 },
  textShadowRadius: 4,
},
  button: {
  backgroundColor: 'rgba(255, 255, 255, 0.25)', // yarı saydam beyaz
  paddingVertical: 14,
  paddingHorizontal: 40,
  borderRadius: 30,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)', // ince kenarlık hissi
},
buttonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '500',
}
});

export default welcomePageStyles;

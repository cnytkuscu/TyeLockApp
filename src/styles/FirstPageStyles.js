import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const firstPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'flex-start', // EKRANIN ÜSTÜNE ALIR
    paddingTop: 60, // Üstten boşluk bırak
  },
  connectionStatusCard: {
    backgroundColor: 'rgba(16, 147, 203, 0)',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    width: '95%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    transition: 'height 0.3s ease-in-out',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  red: {
    color: '#FF5C5C',
  },
  green: {
    color: '#4CAF50',
  },
  orange: {
    color: '#FFA500',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  deviceList: {
    marginTop: 15,
    width: '100%',
    paddingHorizontal: 10,
  },

  deviceItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
});

export default firstPageStyles;

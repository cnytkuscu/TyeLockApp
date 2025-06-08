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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
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
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
  },

  disconnectBtn: {
    borderRadius: 20,
    padding: 6,
    marginLeft: 16,
  },
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginTop: 10,
  }, 
  deviceInfo: {
    flex: 1,
    justifyContent: 'center',
  }, 
  deviceName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default firstPageStyles;

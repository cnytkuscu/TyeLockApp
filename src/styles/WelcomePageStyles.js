import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const welcomePageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
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
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',  
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 4,
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
  languageButtons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },

  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', 
    marginHorizontal: 5,
  },

  langButtonSelected: {
    backgroundColor: 'rgba(228, 228, 228,0.3)',
  },

  langButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:28
  },
});

export default welcomePageStyles;

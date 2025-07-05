import React from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import AnimatedEffectText from './AnimatedEffectText';

const screenWidth = Dimensions.get('window').width;

const RoundedButtonGrid = ({
  buttons = [],
  onLongPressSendBT,
  buttonSize = 100,
  buttonSpacing = 10,
  selectedId = null,
  selectedColor = '#00aaff',
}) => {
  const totalSpacing = buttonSpacing;
  const horizontalPadding = (screenWidth - 2 * buttonSize - totalSpacing) / 2;

  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const getModeForButton = (id, isSelected) => {
    if (!isSelected) return null;
    switch (id) {
      case 1:
        return 'static';
      case 2:
        return 'breathing';
      case 3:
        return 'rainbow';
      case 4:
        return 'pulsingStar';
      default:
        return null;
    }
  };

  const getTextColor = (id, isSelected) => {
    if (id === 2) {
      return isSelected ? selectedColor : '#fff';
    }

    if (isSelected && (id === 1 || id === 4)) {
      return selectedColor;
    }

    if (id === 3) {
      return '#fff';
    }

    return '#fff';
  };

  return (
    <View
      style={[styles.sectionContainer, {paddingHorizontal: horizontalPadding}]}>
      <View style={styles.gridContainer}>
        {buttons.map((button, index) => {
          const isSelected = button.id === selectedId;
          const mode = getModeForButton(button.id, isSelected);
          const textColor = getTextColor(button.id, isSelected);

          return (
            <TouchableOpacity
              key={button.id}
              style={[
                styles.button,
                {
                  width: buttonSize,
                  height: buttonSize
                },
              ]}
              onLongPress={() => {
                ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
                if (onLongPressSendBT) {
                  onLongPressSendBT(button.id);
                }
              }}
              delayLongPress={500}>
              <AnimatedEffectText
                mode={mode}
                color={textColor}
                style={styles.buttonText}>
                {button.label.replace(/ /g, '\n')}
              </AnimatedEffectText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center', // Dikey ortalama
    alignItems: 'center', // Yatay ortalama
    marginBottom: 10,
    marginRight:10
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 30, // Büyük font
    textAlign: 'center', // Metni yatay ortalar (özellikle çok satırlıysa)
  },
});

export default RoundedButtonGrid;

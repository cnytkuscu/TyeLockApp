import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const ColorPickerBar = ({onColorSelected, sendBTCommand}) => {
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const colorSendTimeout = useRef(null);
  const magnifierX = useRef(new Animated.Value(0)).current;
  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: evt => {
        isDragging.current = true;
        const x = evt.nativeEvent.locationX;
        updateColorAtPosition(x);
        magnifierX.setValue(x);
      },

      onPanResponderMove: Animated.event([null, {moveX: magnifierX}], {
        useNativeDriver: false,
        listener: (evt, gestureState) => {
          updateColorAtPosition(gestureState.moveX);
        },
      }),

      onPanResponderRelease: () => {
        isDragging.current = false;
        if (onColorSelected && selectedColor) {
          onColorSelected(selectedColor);
        }
      },
    }),
  ).current;

  const updateColorAtPosition = x => {
    const clampedX = Math.max(0, Math.min(width, x));
    const percent = clampedX / width;
    const hue = Math.round(percent * 360);

    const [r, g, b] = hslToRgb(hue, 100, 50); // canlı renkler
    const color = `rgb(${r}, ${g}, ${b})`;
    setSelectedColor(color);

    if (colorSendTimeout.current) {
      clearTimeout(colorSendTimeout.current);
    }

    colorSendTimeout.current = setTimeout(() => {
      if (sendBTCommand) {
        sendBTCommand('update_clock_color', [r, g, b]);
      }
    }, 1000);

    if (onColorSelected) {
      onColorSelected(color);
    }
  };

  function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return [
      Math.round(f(0) * 255),
      Math.round(f(8) * 255),
      Math.round(f(4) * 255),
    ];
  }

  useEffect(() => {
    return () => {
      if (colorSendTimeout.current) clearTimeout(colorSendTimeout.current);
    };
  }, []);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* GRADIENT BAR */}
      <LinearGradient
        colors={[
          '#FF0000',
          '#FFFF00',
          '#00FF00',
          '#00FFFF',
          '#0000FF',
          '#FF00FF',
          '#FF0000',
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradientBar}
      />

      {/* MAGNIFIER */}
      {isDragging.current && (
        <Animated.View
          style={[
            styles.magnifierContainer,
            {
              transform: [
                {translateX: Animated.subtract(magnifierX, 30)}, // ortalamak için
                {translateY: -70},
                {scale: 1.2},
              ],
            },
          ]}>
          <View
            style={[styles.magnifierBubble, {backgroundColor: selectedColor}]}
          />
          <View style={styles.magnifierShadow} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 40,
    justifyContent: 'center',
  },
  gradientBar: {
    height: 40,
    borderRadius: 10,
    width: width * 0.87,
  },
  magnifier: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 6 : 0,
  },
  magnifierContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  magnifierBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 20,
  },

  magnifierShadow: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    opacity: 0.15,
  },
});

export default ColorPickerBar;

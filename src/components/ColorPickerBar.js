import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width: screenWidth} = Dimensions.get('window');
const BAR_WIDTH = screenWidth * 0.87; // Gradient bar genişliği

const ColorPickerBar = ({onColorSelected, sendBTCommand, externalColor}) => {
  const [selectedColor, setSelectedColor] = useState(
    externalColor || 'rgb(255, 0, 0)',
  );
  const [barLeftOffset, setBarLeftOffset] = useState(0);
  const colorSendTimeout = useRef(null);
  const magnifierX = useRef(new Animated.Value(0)).current;
  const indicatorX = useRef(new Animated.Value(0)).current;
  const isDragging = useRef(false);

  // externalColor değiştiğinde selectedColor, magnifierX ve indicatorX güncelle
  useEffect(() => {
    if (externalColor) {
      setSelectedColor(externalColor);

      const match = externalColor.match(/\d+/g);
      if (match && match.length === 3) {
        const [r, g, b] = match.map(Number);
        const hue = rgbToHue(r, g, b);
        const x = (hue / 360) * BAR_WIDTH;

        magnifierX.setValue(x);
        indicatorX.setValue(x);
      }
    }
  }, [externalColor]);

  // PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: evt => {
        isDragging.current = true;
        const x = evt.nativeEvent.locationX;
        updateColorAtPosition(x);
        magnifierX.setValue(x);
        indicatorX.setValue(x);
      },

      onPanResponderMove: Animated.event([null, {moveX: magnifierX}], {
        useNativeDriver: false,
        listener: (evt, gestureState) => {
          if (typeof gestureState.moveX !== 'number') {
            console.warn('moveX undefined veya geçersiz:', gestureState.moveX);
            return;
          }
          const localX = gestureState.moveX - barLeftOffset;
          updateColorAtPosition(localX);
          magnifierX.setValue(localX);
          indicatorX.setValue(localX);
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

  // Renk güncelleme fonksiyonu
  const updateColorAtPosition = x => {
    if (typeof x !== 'number' || isNaN(x)) {
      console.warn('updateColorAtPosition: geçersiz x değeri:', x);
      return;
    }

    const clampedX = Math.max(0, Math.min(BAR_WIDTH, x));
    const percent = Math.min(clampedX / BAR_WIDTH, 0.9999);
    const hue = Math.round(percent * 360);
    const correctedHue = hue === 360 ? 0 : hue;
    const [r, g, b] = hslToRgb(correctedHue, 100, 50);
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

  // HSL to RGB dönüşümü (standart ve doğru)
  function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
  }

  // RGB to Hue dönüşümü (0-360)
  function rgbToHue(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;

    if (max === min) {
      h = 0;
    } else if (max === r) {
      h = (60 * ((g - b) / (max - min)) + 360) % 360;
    } else if (max === g) {
      h = (60 * ((b - r) / (max - min)) + 120) % 360;
    } else if (max === b) {
      h = (60 * ((r - g) / (max - min)) + 240) % 360;
    }

    return Math.round(h);
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (colorSendTimeout.current) clearTimeout(colorSendTimeout.current);
    };
  }, []);

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers}
      onLayout={event => {
        const x = event.nativeEvent.layout.x;
        setBarLeftOffset(x);
      }}>
      {/* Gradient Bar */}
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

      {/* Yarı saydam beyaz dikey şerit */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            transform: [{translateX: Animated.subtract(indicatorX, 10)}], // 20 genişlik / 2
          },
        ]}
      />

      {/* Magnifier */}
      {isDragging.current && (
        <Animated.View
          style={[
            styles.magnifierContainer,
            {
              transform: [
                {translateX: Animated.subtract(magnifierX, 30)}, // 60 genişlik / 2
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
    width: BAR_WIDTH,
  },
  indicator: {
    position: 'absolute',
    top: -5,
    height: 50, // gradientBar yüksekliği + biraz fazlası
    width: 20, // istediğin şerit genişliği
    backgroundColor: 'rgba(255,255,255,0.6)', // yarı saydam beyaz
    borderRadius: 1,
    zIndex: 15,
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

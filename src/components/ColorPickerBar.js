import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const {width: screenWidth} = Dimensions.get('window');
const BAR_WIDTH = screenWidth * 0.87;
const BAR_HEIGHT = 24;
const THUMB_SIZE = 32;

const ColorPickerBar = ({onColorSelected, sendBTCommand, externalColor}) => {
  const translateX = useSharedValue(0);
  const hueValue = useSharedValue(0);
  const colorSendTimeout = useRef(null);

  useEffect(() => {
    if (!externalColor) return;
    const match = externalColor.match(/\d+/g);
    if (match?.length === 3) {
      const [r, g, b] = match.map(Number);
      const hue = rgbToHue(r, g, b);
      const x = (hue / 360) * BAR_WIDTH;
      translateX.value = withTiming(x);
      hueValue.value = hue;
    }
  }, [externalColor]);

  const scheduleBT = hue => {
    const [r, g, b] = hslToRgb(hue, 100, 50);
    if (colorSendTimeout.current) clearTimeout(colorSendTimeout.current);
    colorSendTimeout.current = setTimeout(() => {
      sendBTCommand('update_clock_color', [r, g, b]);
    }, 1000);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (evt, ctx) => {
      let x = ctx.startX + evt.translationX;
      x = Math.max(0, Math.min(x, BAR_WIDTH));
      translateX.value = x;

      const hue = Math.round((x / BAR_WIDTH) * 360);
      hueValue.value = hue;

      const [r, g, b] = hslToRgb(hue, 100, 50);
      runOnJS(onColorSelected)(`rgb(${r},${g},${b})`);

      runOnJS(scheduleBT)(hue);
    },
  });

  const thumbStyle = useAnimatedStyle(() => {
    const [r, g, b] = hslToRgb(hueValue.value, 100, 50);
    return {
      transform: [{translateX: translateX.value - THUMB_SIZE / 2}],
      backgroundColor: `rgb(${r},${g},${b})`,
    };
  });

  return (
    <View style={styles.container}>
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
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </PanGestureHandler>
    </View>
  );
};

function hslToRgb(h, s, l) {
  'worklet';
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function rgbToHue(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    if (max === r) h = ((g - b) / (max - min) + 6) % 6;
    else if (max === g) h = (b - r) / (max - min) + 2;
    else h = (r - g) / (max - min) + 4;
    h = Math.round(h * 60);
  }
  return h;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: BAR_WIDTH,
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  gradientBar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ColorPickerBar;

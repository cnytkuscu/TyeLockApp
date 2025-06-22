import React, {useEffect, useRef, useState} from 'react';
import {Animated, Text, View} from 'react-native';

const rainbowColors = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#8F00FF',
];

const AnimatedEffectText = ({mode, color, style, children}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const [highlightIndex, setHighlightIndex] = useState(null);

  // Pulsing efektine özel rastgele harf parlatma döngüsü
  useEffect(() => {
    let timeoutId;

    if (mode === 'pulsingStar' && typeof children === 'string') {
      const flatLength = children.replace(/\n/g, '').length;

      const animateRandom = () => {
        const randomIndex = Math.floor(Math.random() * flatLength);
        setHighlightIndex(randomIndex);

        setTimeout(
          () => setHighlightIndex(null),
          Math.floor(Math.random() * (65 - 50 + 1)) + 50,
        );

        const nextDelay = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
        timeoutId = setTimeout(animateRandom, nextDelay);
      };

      animateRandom(); // İlk çalıştırma
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [mode, children]);

  // Diğer modlar için animasyonlar
  useEffect(() => {
    if (mode === 'breathing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else if (mode === 'rainbow') {
      Animated.loop(
        Animated.timing(animValue, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
      ).start();
    } else {
      animValue.setValue(1);
    }
  }, [mode]);

  // Rainbow interpolasyon
  const interpolatedColor =
    mode === 'rainbow'
      ? animValue.interpolate({
          inputRange: rainbowColors.map(
            (_, i) => i / (rainbowColors.length - 1),
          ),
          outputRange: rainbowColors,
        })
      : color;

  // Opaklık animasyonu (breathing için)
  const animatedOpacity = mode === 'breathing' ? animValue : 1;

  // Pulsing Star özel render (çok satırlı destekli)
  if (mode === 'pulsingStar' && typeof children === 'string') {
    const lines = children.split('\n');
    let globalIndex = 0;

    return (
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        {lines.map((line, lineIdx) => (
          <View key={lineIdx} style={{flexDirection: 'row'}}>
            {line.split('').map((char, charIdx) => {
              const currentIndex = globalIndex;
              globalIndex += 1;

              return (
                <Text
                  key={charIdx}
                  style={[
                    style,
                    {
                      color:
                        currentIndex === highlightIndex ? '#ffffff' : color,
                    },
                  ]}>
                  {char}
                </Text>
              );
            })}
          </View>
        ))}
      </View>
    );
  }

  return (
    <Animated.Text
      style={[
        style,
        {
          color: interpolatedColor,
          opacity: animatedOpacity,
        },
      ]}>
      {children}
    </Animated.Text>
  );
};

export default AnimatedEffectText;

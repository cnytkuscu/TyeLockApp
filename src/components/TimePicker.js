import React, {useEffect, useRef} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

const ITEM_HEIGHT = 40;

const TimePicker = ({label, maxValue, value, onChange}) => {
  const data = Array.from({length: maxValue + 1}, (_, i) => i);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current && typeof value === 'number') {
      flatListRef.current.scrollToIndex({index: value, animated: true});
    }
  }, [value]);

  const onScrollEnd = e => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const selectedIndex = Math.round(offsetY / ITEM_HEIGHT);
    if (selectedIndex !== value) {
      onChange(selectedIndex);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.item, item === value && styles.selectedItem]}
      onPress={() => onChange(item)}>
      <Text style={[styles.itemText, item === value && styles.selectedText]}>
        {item < 10 ? `0${item}` : item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={item => item.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={value}
        onMomentumScrollEnd={onScrollEnd}
        style={{height: ITEM_HEIGHT * 1}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center', marginHorizontal: 8},
  label: {fontWeight: 'bold', color: '#fff', fontSize: 16, marginBottom: 6},
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {color: '#fff', fontSize: 50, fontWeight: 'bold', letterSpacing: 0},
  selectedItem: {
    borderRadius: 6,
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 35,
  },
});

export default TimePicker;

import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

export default props => {
  const { style, imageStyle, action, source, small, mode } = props;
  return (
    <TouchableOpacity
      style={[styles.style, style]}
      activeOpacity={0.8}
      onPress={() => action()}
    >
      <Image
        source={source}
        resizeMode={mode || 'contain'}
        style={[styles.image, small && styles.small, imageStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  style: { padding: 0 },
  image: {
    width: 30,
    height: 30,
  },
  small: {
    width: 25,
    height: 25,
  },
});

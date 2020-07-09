import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default props => {
  const {
    action,
    title,
    disabled,
    centered,
    outlined,
    color,
    style,
    fontSize,
  } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => action()}
      style={[
        styles.style,
        centered && styles.centered,
        disabled && styles.disabled,
        outlined && styles.outlined,
        color && { borderColor: color || 'black' },
        style,
      ]}
    >
      <Text style={[styles.text, color && { color }, fontSize && { fontSize }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  style: {
    padding: 5,
    borderRadius: 10,
    alignSelf: 'center',
  },
  centered: { alignSelf: 'center' },
  outlined: {
    borderWidth: 1,
    paddingHorizontal: 30,
  },
  disabled: { opacity: 0.5 },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});

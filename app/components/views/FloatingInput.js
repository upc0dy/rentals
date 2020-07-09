import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FloatingLabel from 'react-native-floating-labels';

export default ({
  value,
  placeholder,
  error,
  password,
  keyboardType,
  color,
  autoCapitalize,
  autoCorrect,
  onChangeText,
  onBlur,
  onFocus,
  multiline,
  fullWidth,
}) => (
  <View style={[styles.container, fullWidth && styles.fullWidth]}>
    <View style={[styles.input, error && styles.error]}>
      <FloatingLabel
        value={value}
        multiline={multiline || false}
        autoCorrect={autoCorrect || false}
        autoCapitalize={autoCapitalize || 'none'}
        secureTextEntry={password}
        keyboardType={keyboardType || 'default'}
        labelStyle={styles.labelStyle}
        inputStyle={[styles.inputStyle, color && { color }]}
        onChangeText={text => onChangeText(text)}
        onFocus={onFocus && onFocus}
        onBlur={onBlur && onBlur}
      >
        {placeholder || ''}
      </FloatingLabel>
    </View>
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  fullWidth: { flex: 1 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  error: { borderBottomColor: '#F02342' },
  errorText: {
    color: '#F02342',
    margin: 2,
  },
  labelStyle: {
    paddingLeft: 0,
    color: '#9DA1B4',
  },
  inputStyle: {
    color: 'black',
    borderWidth: 0,
    padding: 0,
  },
});

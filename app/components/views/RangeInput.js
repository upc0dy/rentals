import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import FloatingLabel from 'react-native-floating-labels';

export default ({
  value,
  placeholder,
  error,
  onChangeText,
  onBlur,
  onFocus,
}) => (
  <View style={styles.container}>
    <View style={styles.range}>
      <View style={[styles.input, error && styles.error]}>
        <FloatingLabel
          value={value[0]}
          keyboardType={
            Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'
          }
          labelStyle={styles.labelStyle}
          inputStyle={styles.inputStyle}
          onChangeText={text => onChangeText[0](text)}
          onFocus={onFocus && onFocus}
          onBlur={onBlur && onBlur}
        >
          {placeholder[0] || ''}
        </FloatingLabel>
      </View>
      <View style={styles.spacing} />
      <View style={[styles.input, error && styles.error]}>
        <FloatingLabel
          value={value[1]}
          keyboardType={
            Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'
          }
          labelStyle={styles.labelStyle}
          inputStyle={styles.inputStyle}
          onChangeText={text => onChangeText[1](text)}
          onFocus={onFocus && onFocus}
          onBlur={onBlur && onBlur}
        >
          {placeholder[1] || ''}
        </FloatingLabel>
      </View>
    </View>
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  range: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  error: { borderBottomColor: '#F02342' },
  errorText: {
    color: '#F02342',
    fontSize: 13,
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
  spacing: { width: 20 },
});

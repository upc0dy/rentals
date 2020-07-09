import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import ImageButton from './ImageButton';

const NavHeader = ({ navigation, type, leftAction, rightAction, user }) => (
  <View style={styles.container}>
    {type !== 1 && (
      <ImageButton
        source={require('assets/Back.png')}
        action={() => (type > 3 ? leftAction() : navigation.goBack())}
      />
    )}
    <Text style={styles.title}>
      {type === 3
        ? 'Apartment Details'
        : type === 4
        ? 'Update an apartment'
        : type === 5
        ? 'Create an apartment'
        : user.username}
    </Text>
    <View style={styles.actions}>
      {(type < 3 || user.role !== 1) && (
        <ImageButton
          style={styles.action}
          source={
            type === 1
              ? require('assets/Settings.png')
              : type === 2
              ? require('assets/Quit.png')
              : type === 3
              ? require('assets/Edit.png')
              : require('assets/Done.png')
          }
          action={
            type === 1
              ? () => navigation.navigate('Settings')
              : type > 3
              ? rightAction[0]
              : rightAction
          }
        />
      )}
      {type > 3 && user.role !== 1 && (
        <ImageButton
          source={require('assets/Delete.png')}
          action={rightAction[1]}
        />
      )}
      {type === 1 && user.role !== 1 && (
        <ImageButton source={require('assets/Add.png')} action={rightAction} />
      )}
    </View>
  </View>
);

const styles = new StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  action: { marginLeft: 10 },
});

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(NavHeader);

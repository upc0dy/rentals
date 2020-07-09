import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import moment from 'moment';

export default props => {
  const {
    item: { avatar, username, email, role, approved, blocked, createdAt },
  } = props;
  const roles = ['Client', 'Realtor'];

  return (
    <View style={styles.row}>
      <Image
        style={styles.avatar}
        resizeMode="cover"
        source={{ uri: `http://192.168.1.55:5000/${avatar}` }}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.role}>{roles[role - 1]}</Text>
        <Text style={styles.time}>
          {moment(createdAt).format('MMM DD hh:mm A')}
        </Text>
        {blocked && (
          <Image
            style={styles.blocked}
            resizeMode="contain"
            source={require('assets/Blocked.png')}
          />
        )}
      </View>
      {!approved && (
        <Image
          style={styles.new}
          resizeMode="contain"
          source={require('assets/New.png')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 24,
  },
  content: {
    flex: 1,
    paddingLeft: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'dodgerblue',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    margin: 3,
    paddingLeft: 10,
  },
  info: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  role: {
    fontStyle: 'italic',
    fontWeight: '600',
  },
  time: {
    marginTop: 5,
    fontSize: 12,
  },
  new: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 40,
    height: 40,
  },
  blocked: {
    position: 'absolute',
    top: -18,
    left: -30,
    width: 70,
    height: 50,
  },
});

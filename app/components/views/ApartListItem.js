import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import moment from 'moment';

export default props => {
  const {
    item: { name, description, status, createdAt },
  } = props;

  const statusStyle = status ? styles.good : styles.normal;

  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.amount}>
          <Text style={[styles.status, statusStyle]}>
            {status ? 'Available' : 'Rented'}
          </Text>
        </Text>
        <Text style={styles.time}>
          {moment(createdAt).format('YYYY-MM-DD hh:mm A')}
        </Text>
      </View>
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
  content: { flex: 1 },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  desc: {
    margin: 3,
    paddingLeft: 10,
  },
  info: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 20,
    fontWeight: '600',
  },
  good: {
    color: '#00A651',
  },
  normal: {
    color: 'black',
  },
  time: {
    marginTop: 5,
    fontSize: 12,
  },
});

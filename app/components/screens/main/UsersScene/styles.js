import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  footer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  none: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 20,
  },
  rowActions: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rowAction: { marginLeft: 15 },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

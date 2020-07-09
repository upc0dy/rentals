import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 10,
  },
  avatarView: { alignSelf: 'center' },
  avatar: {
    marginTop: 10,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'dodgerblue',
    alignSelf: 'center',
  },
  form: { margin: 40 },
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

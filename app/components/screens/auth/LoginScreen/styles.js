import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('screen');

export default StyleSheet.create({
  container: { flex: 1 },
  form: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 50,
  },
  button: { marginTop: 20 },
  socials: {
    marginTop: 30,
    marginBottom: 0,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialImage: {
    width: (width - 100) / 2,
    height: (width - 100) / 8,
  },
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
  footer: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  action: {
    color: 'black',
    fontSize: 18,
  },
});

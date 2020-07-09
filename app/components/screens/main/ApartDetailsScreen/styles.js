import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('screen');

export default new StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    width: 180,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addrLabel: {
    width: 100,
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    flex: 1,
    flexGrow: 1,
    fontSize: 16,
  },
  addrText: {
    flex: 1,
    paddingRight: 90,
    fontSize: 16,
  },
  pickBtn: {
    position: 'absolute',
    right: 0,
  },
  addrView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  addrInput: { top: 60 },
  map: {
    marginTop: 20,
    width: width - 40,
    height: width + 100,
    marginBottom: 10,
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
});

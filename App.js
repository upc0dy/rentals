import React from 'react';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import createStore from 'store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from 'screens/auth/LoginScreen';
import RegisterScreen from 'screens/auth/RegisterScreen';
import HomeScreen from 'screens/main/HomeScreen';
import SettingsScreen from 'screens/main/SettingsScreen';
import ApartDetailsScreen from 'screens/main/ApartDetailsScreen';

import { GoogleHelper } from 'models/social';
import { warnings } from 'app.json';

GoogleHelper.configure();
YellowBox.ignoreWarnings(warnings);

const { store, persistor } = createStore();
const Stack = createStackNavigator();

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            headerMode="none"
            screenOptions={{ gestureEnabled: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ApartDetails" component={ApartDetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

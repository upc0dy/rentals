import { Alert } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import { IOS_CLIENT_ID } from 'app.json';

export const GoogleHelper = {
  configure: () => GoogleSignin.configure({ iosClientId: IOS_CLIENT_ID }),

  login: cb => {
    GoogleSignin.signIn()
      .then(_ => GoogleHelper.loginWithToken(cb))
      .catch(
        err =>
          !err.message.includes('cancel') &&
          Alert.alert('Google Login Failure', err.message),
      );
  },

  loginWithToken: cb => {
    GoogleSignin.getTokens()
      .then(({ accessToken: access_token }) =>
        cb({ access_token, type: 'Google' }),
      )
      .catch(err => Alert.alert('Google Login Failure', err.message));
  },

  logout: () => GoogleSignin.signOut(),

  isLoggedIn: cb => {
    GoogleSignin.isSignedIn()
      .then(result => cb(result))
      .catch(_ => cb(false));
  },

  getCurrentUser: cb => {
    GoogleSignin.getCurrentUser()
      .then(user => cb(user))
      .catch(_ => cb(null));
  },
};

export const FacebookHelper = {
  login: cb => {
    LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      async result => {
        if (result.isCancelled) {
        } else {
          const {
            accessToken: access_token,
          } = await AccessToken.getCurrentAccessToken();
          cb({ access_token, type: 'Facebook' });
        }
      },
      error => Alert.alert('Facebook Login Failure', error),
    );
  },

  isLoggedIn: cb => {
    AccessToken.getCurrentAccessToken()
      .then(({ accessToken }) => cb(accessToken))
      .catch(_ => cb(null));
  },
};

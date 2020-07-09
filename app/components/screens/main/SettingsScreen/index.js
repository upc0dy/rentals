import React from 'react';
import { View, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UIActivityIndicator } from 'react-native-indicators';
import ImagePicker from 'react-native-image-picker';
import { LoginManager } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import { logoutUser, inviteUser, uploadAvatar } from 'store/user/actions';
import NavHeader from 'views/NavHeader';
import FloatingInput from 'views/FloatingInput';
import ImageButton from 'views/ImageButton';
import Button from 'views/Button';
import validator from 'models';
import { GoogleHelper, FacebookHelper } from 'models/social';
import styles from './styles';

class SettingsScreen extends React.Component {
  state = { email: '', error: null };

  openPicker = () => {
    const { doUploadAvatar, navigation } = this.props;
    ImagePicker.showImagePicker(
      {
        title: 'Select Avatar',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      response => {
        if (response.didCancel || response.error) {
        } else {
          doUploadAvatar({
            uri:
              Platform.OS === 'ios'
                ? response.uri.replace('file://', '')
                : 'file://' + response.path,
            navigation,
          });
        }
      },
    );
  };

  logout = () => {
    const { doLogout, navigation } = this.props;
    Alert.alert('Warning!', 'Are you sure to log out?', [
      {
        text: 'NO',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: _ => {
          GoogleHelper.isLoggedIn(result => result && GoogleHelper.logout());
          FacebookHelper.isLoggedIn(result => result && LoginManager.logout());
          doLogout(navigation);
        },
        style: 'default',
      },
    ]);
  };

  inviteUser = () => {
    const { email } = this.state;
    const { doInviteUser, navigation } = this.props;
    doInviteUser({ email, navigation });
  };

  render = () => {
    const { user, isFetching, navigation } = this.props;
    const { email, error } = this.state;
    const disabled = validator('email', email);

    return (
      user && (
        <SafeAreaView style={styles.container}>
          <NavHeader
            type={2}
            navigation={navigation}
            rightAction={this.logout}
          />
          <View style={styles.content}>
            <ImageButton
              action={this.openPicker}
              mode="cover"
              source={{ uri: `http://192.168.1.55:5000/${user.avatar}` }}
              style={styles.avatarView}
              imageStyle={styles.avatar}
            />
            {user.role === 3 && (
              <View style={styles.form}>
                <FloatingInput
                  placeholder="Email"
                  value={email}
                  error={error}
                  onChangeText={text => this.setState({ email: text.trim() })}
                  onFocus={() => this.setState({ error: null })}
                  onBlur={() =>
                    this.setState({ error: validator('email', email) })
                  }
                />
                <Button
                  disabled={disabled}
                  title="Invite"
                  action={this.inviteUser}
                />
              </View>
            )}
          </View>
          {isFetching && (
            <View style={styles.indicator}>
              <UIActivityIndicator
                style={styles.indicator}
                color="dodgerblue"
              />
            </View>
          )}
        </SafeAreaView>
      )
    );
  };
}

const mapStateToProps = state => ({
  user: state.user.user,
  isFetching: state.user.isFetching,
});

const mapDispatchToProps = dispatch => ({
  doLogout: navigation => {
    dispatch(logoutUser(navigation));
  },
  doInviteUser: payload => {
    dispatch(inviteUser(payload));
  },
  doUploadAvatar: payload => {
    dispatch(uploadAvatar(payload));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);

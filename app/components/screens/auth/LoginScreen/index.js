import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UIActivityIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import { loginUser, resetUser } from 'store/user/actions';
import { resetApart } from 'store/apart/actions';
import FloatingInput from 'views/FloatingInput';
import ImageButton from 'views/ImageButton';
import Button from 'views/Button';
import validator from 'models';
import { GoogleHelper, FacebookHelper } from 'models/social';
import styles from './styles';

class LoginScreen extends React.Component {
  state = {
    email: '',
    password: '',
    errorEmail: null,
    errorPass: null,
    contentHeight: 0,
    layoutHeight: 0,
  };

  componentDidMount = () => {
    const { accountType } = this.props;
    if (!accountType) {
      return;
    } else if (accountType === 'jwt') {
      const {
        user: { email, password },
      } = this.props;
      this.setState(
        { email, password },
        () =>
          !(validator('email', email) || validator('password', password)) &&
          this.login(),
      );
    } else if (accountType === 'google') {
      GoogleHelper.isLoggedIn(
        result => result && GoogleHelper.loginWithToken(this.socialLogin),
      );
    } else {
      FacebookHelper.isLoggedIn(
        access_token =>
          access_token && this.socialLogin({ access_token, type: 'Facebook' }),
      );
    }
  };

  login = () => {
    const { email, password } = this.state;
    const { doLogin, navigation } = this.props;
    doLogin({ email, password, navigation });
  };

  socialLogin = params => {
    const { doLogin, navigation } = this.props;
    doLogin({ ...params, navigation });
  };

  render = () => {
    const {
      email,
      password,
      errorEmail,
      errorPass,
      contentHeight,
      layoutHeight,
    } = this.state;
    const { isFetching, navigation } = this.props;
    const validForm = !(
      validator('email', email) || validator('password', password)
    );
    const scrollEnabled = contentHeight > layoutHeight;

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.form}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={(_, height) =>
            this.setState({ contentHeight: height })
          }
          onLayout={event =>
            this.setState({ layoutHeight: event.nativeEvent.layout.height })
          }
        >
          <Text style={styles.title}>Rentals</Text>
          <FloatingInput
            value={email}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errorEmail}
            onChangeText={text => this.setState({ email: text.trim() })}
            onFocus={_ => this.setState({ errorEmail: null })}
            onBlur={_ =>
              this.setState({ errorEmail: validator('email', email) })
            }
          />
          <FloatingInput
            value={password}
            password
            placeholder="Password"
            keyboardType="ascii-capable"
            autoCapitalize="none"
            error={errorPass}
            onChangeText={text => this.setState({ password: text })}
            onFocus={_ => this.setState({ errorPass: null })}
            onBlur={_ =>
              this.setState({ errorPass: validator('password', password) })
            }
          />
          <Button
            title="Login"
            centered
            outlined
            style={styles.button}
            disabled={!validForm}
            action={() => this.login()}
          />
          <View style={styles.socials}>
            <ImageButton
              imageStyle={styles.socialImage}
              source={require('assets/Facebook.png')}
              action={() => FacebookHelper.login(this.socialLogin)}
            />
            <ImageButton
              imageStyle={styles.socialImage}
              source={require('assets/Google.png')}
              action={() => GoogleHelper.login(this.socialLogin)}
            />
          </View>
        </KeyboardAwareScrollView>
        <Text style={styles.footer}>
          Don't have an account yet?
          <Text
            style={styles.action}
            onPress={() => navigation.navigate('Register')}
          >
            {' Register '}
          </Text>
        </Text>
        {isFetching && (
          <View style={styles.indicator}>
            <UIActivityIndicator color="dodgerblue" />
          </View>
        )}
      </SafeAreaView>
    );
  };
}

const mapStateToProps = state => ({
  user: state.user.user,
  accountType: state.user.accountType,
  isFetching: state.user.isFetching,
});

const mapDispatchToProps = dispatch => ({
  doLogin: payload => {
    dispatch(loginUser(payload));
  },
  doReset: _ => {
    dispatch(resetUser());
    dispatch(resetApart());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);

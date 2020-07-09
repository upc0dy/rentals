import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-material-dropdown';
import { UIActivityIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import { registerUser } from 'store/user/actions';
import FloatingInput from 'views/FloatingInput';
import Button from 'views/Button';
import validator from 'models';
import styles from './styles';

class RegisterScreen extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConf: '',
    role: 1,
    errorName: null,
    errorEmail: null,
    errorPass: null,
    errorPassConf: null,
    contentHeight: 0,
    layoutHeight: 0,
  };

  register = () => {
    const { username, email, password, role } = this.state;
    const { doRegister, navigation } = this.props;
    doRegister({ username, email, password, role, navigation });
  };

  render = () => {
    const {
      username,
      email,
      password,
      passwordConf,
      role,
      errorName,
      errorEmail,
      errorPass,
      errorPassConf,
      contentHeight,
      layoutHeight,
    } = this.state;
    const { isFetching, navigation } = this.props;
    const validForm = !(
      validator('username', username) ||
      validator('email', email) ||
      (validator('password', password) && password === passwordConf)
    );
    const scrollEnabled = contentHeight > layoutHeight;
    const roles = [{ value: 'Client' }, { value: 'Realtor' }];

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
            value={username}
            placeholder="Name"
            keyboardType="ascii-capable"
            autoCapitalize="none"
            autoCorrect
            error={errorName}
            onChangeText={text => this.setState({ username: text.trim() })}
            onFocus={_ => this.setState({ errorName: null })}
            onBlur={_ =>
              this.setState({ errorName: validator('username', username) })
            }
          />
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
          <FloatingInput
            value={passwordConf}
            password
            placeholder="Confirm Password"
            keyboardType="ascii-capable"
            autoCapitalize="none"
            error={errorPassConf}
            onChangeText={text => this.setState({ passwordConf: text })}
            onFocus={_ => this.setState({ errorPassConf: null })}
            onBlur={_ =>
              this.setState({
                errorPassConf:
                  passwordConf !== password && 'Confirm password is mismatched',
              })
            }
          />
          <Dropdown
            label="User Role"
            data={roles}
            value={roles[role - 1].value}
            onChangeText={(_, r) => {
              this.setState({ role: r + 1 });
            }}
          />
          <Button
            title="Register"
            centered
            outlined
            style={styles.button}
            disabled={!validForm}
            action={() => this.register()}
          />
        </KeyboardAwareScrollView>
        <Text style={styles.footer}>
          Already have an account?
          <Text style={styles.action} onPress={() => navigation.goBack()}>
            {' Login '}
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
  isFetching: state.user.isFetching,
});

const mapDispatchToProps = dispatch => ({
  doRegister: payload => {
    dispatch(registerUser(payload));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterScreen);

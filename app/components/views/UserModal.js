import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import CheckBox, { LABEL_POSITION } from 'react-native-circle-checkbox';
import { Dropdown } from 'react-native-material-dropdown';
import validator from 'models';
import FloatingInput from './FloatingInput';
import Button from './Button';

export default class UserModal extends React.Component {
  state = {
    isVisible: false,
    user: null,
    username: '',
    email: '',
    password: '',
    role: 1,
    blocked: false,
    errorName: null,
    errorEmail: null,
    errorPass: null,
    errorLimit: null,
  };

  show = user => {
    this.setState({
      isVisible: true,
      user,
      username: !user ? '' : user.username,
      email: !user ? '' : user.email,
      password: !user ? '' : user.password,
      role: !user ? 1 : user.role,
      blocked: !user ? false : user.blocked,
      errorName: null,
      errorEmail: null,
      errorPass: null,
      errorLimit: null,
    });
  };

  dismiss = cb =>
    this.setState(
      {
        isVisible: false,
        errorName: null,
        errorEmail: null,
        errorPass: null,
        errorLimit: null,
      },
      () => cb && setTimeout(cb, 500),
    );

  action = () => {
    this.dismiss(() => {
      const { action, navigation } = this.props;
      const { user, username, email, password, role, blocked } = this.state;

      const params = { username, email, password, role, navigation };
      action(!user ? params : { ...params, blocked, _id: user._id });
    });
  };

  render = () => {
    const {
      isVisible,
      user,
      username,
      email,
      password,
      role,
      blocked,
      errorName,
      errorEmail,
      errorPass,
    } = this.state;
    const validForm = !(
      validator('username', username) ||
      validator('email', email) ||
      (!user && validator('password', password))
    );
    let roles = [{ value: 'Client' }, { value: 'Realtor' }];
    const radioProps = {
      outerColor: 'dodgerblue',
      filterColor: '#EEE',
      innerColor: 'dodgerblue',
    };

    return (
      <Modal
        isVisible={isVisible}
        style={styles.modal}
        swipeDirection="down"
        backdropOpacity={0.4}
        onBackdropPress={() => this.dismiss()}
        onSwipeComplete={() => this.dismiss()}
      >
        <View style={[styles.modalContent]}>
          <Text style={styles.title}>{!user ? 'Create' : 'Update'} a user</Text>
          <FloatingInput
            value={username}
            placeholder="Name"
            keyboardType="ascii-capable"
            error={errorName}
            onChangeText={text => this.setState({ username: text })}
            onFocus={_ => this.setState({ errorName: null })}
            onBlur={_ =>
              this.setState({ errorName: validator('username', username) })
            }
          />
          <FloatingInput
            value={email}
            placeholder="Email"
            keyboardType="email-address"
            error={errorEmail}
            onChangeText={text => this.setState({ email: text })}
            onFocus={_ => this.setState({ errorEmail: null })}
            onBlur={_ =>
              this.setState({ errorEmail: validator('email', email) })
            }
          />
          {!user && (
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
          )}
          <Dropdown
            label="User Role"
            data={roles}
            value={roles[role - 1].value}
            onChangeText={(_, r) => {
              this.setState({ role: r + 1 });
            }}
          />
          {user && (
            <CheckBox
              {...radioProps}
              checked={blocked}
              label="Blocked Status"
              styleLabel={styles.label}
              labelPosition={LABEL_POSITION.LEFT}
              styleCheckboxContainer={styles.status}
              onToggle={checked => this.setState({ blocked: checked })}
            />
          )}
          <Button
            outlined
            centered
            disabled={!validForm}
            title="Submit"
            action={this.action}
          />
        </View>
      </Modal>
    );
  };
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
  status: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  label: {
    fontSize: 18,
    marginRight: 20,
  },
});

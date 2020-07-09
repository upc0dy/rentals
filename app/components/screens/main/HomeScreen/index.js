import React from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { createUser } from 'store/user/actions';
import ApartsScene from 'screens/main/ApartsScene';
import UsersScene from 'screens/main/UsersScene';
import NavHeader from 'views/NavHeader';
import UserModal from 'views/UserModal';
import styles from './styles';
const { width } = Dimensions.get('screen');

class HomeScreen extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'users', title: 'Users' },
      { key: 'aparts', title: 'Apartments' },
    ],
  };

  rightAction = () => {
    const { user, navigation } = this.props;
    const { index } = this.state;
    if (user.role === 3 && index === 0) {
      this.userModal.show();
    } else {
      navigation.navigate('ApartDetails');
    }
  };

  render = () => {
    const { user, doCreateUser, navigation } = this.props;
    const { index } = this.state;

    return (
      user && (
        <SafeAreaView style={styles.container}>
          <NavHeader
            type={1}
            navigation={navigation}
            rightAction={this.rightAction}
          />
          {user.role === 3 ? (
            <TabView
              navigationState={this.state}
              renderScene={SceneMap({
                users: () => (
                  <UsersScene navigation={navigation} index={index} />
                ),
                aparts: () => (
                  <ApartsScene navigation={navigation} index={index} />
                ),
              })}
              swipeEnabled={false}
              onIndexChange={ind => this.setState({ index: ind })}
              initialLayout={{ width }}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  indicatorStyle={styles.indicator}
                  style={styles.background}
                  labelStyle={styles.label}
                  activeColor="dodgerblue"
                  inactiveColor="black"
                />
              )}
            />
          ) : (
            <ApartsScene navigation={navigation} />
          )}
          <UserModal
            ref={ref => (this.userModal = ref)}
            navigation={navigation}
            action={doCreateUser}
          />
        </SafeAreaView>
      )
    );
  };
}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  doCreateUser: payload => {
    dispatch(createUser(payload));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);

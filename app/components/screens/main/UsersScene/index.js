import React from 'react';
import { View, Text, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { UIActivityIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import { readUsers, updateUser, deleteUser } from 'store/user/actions';
import UserListItem from 'views/UserListItem';
import UserModal from 'views/UserModal';
import ImageButton from 'views/ImageButton';
import styles from './styles';

class UsersScene extends React.Component {
  componentDidMount = () => {
    const { doReadUsers, navigation, index } = this.props;
    if (index !== 1) {
      doReadUsers({ navigation, index });
    }
  };

  closeRows = () => this.swipeListView.safeCloseOpenRow();

  deleteUser = _id => {
    const { doDeleteUser, navigation } = this.props;

    Alert.alert('Warning!', 'Are you sure to delete this user?', [
      {
        text: 'NO',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: _ => doDeleteUser({ _id, navigation }),
        style: 'default',
      },
    ]);
  };

  render = () => {
    const { users, doUpdateUser, isFetching, navigation } = this.props;

    return (
      <View style={styles.container}>
        {users.length > 0 ? (
          <SwipeListView
            ref={ref => (this.swipeListView = ref)}
            style={styles.container}
            data={users}
            renderItem={({ item }) => <UserListItem item={item} />}
            renderHiddenItem={({ item }) => (
              <View style={styles.rowActions}>
                <ImageButton
                  small
                  source={require('assets/Edit.png')}
                  action={() => {
                    this.closeRows();
                    this.userModal.show(item);
                  }}
                />
                <ImageButton
                  small
                  style={styles.rowAction}
                  source={require('assets/Delete.png')}
                  action={() => {
                    this.closeRows();
                    this.deleteUser(item._id);
                  }}
                />
              </View>
            )}
            ListFooterComponent={
              <View style={styles.footer}>
                <Text>--- No more users ---</Text>
              </View>
            }
            disableRightSwipe
            closeOnRowBeginSwipe
            closeOnRowOpen
            rightOpenValue={-80}
            keyExtractor={(_, index) => '' + index}
          />
        ) : (
          <Text style={styles.none}>No apartments matching filters</Text>
        )}
        <UserModal
          ref={ref => (this.userModal = ref)}
          navigation={navigation}
          action={doUpdateUser}
        />
        {isFetching && (
          <View style={styles.indicator}>
            <UIActivityIndicator color="dodgerblue" />
          </View>
        )}
      </View>
    );
  };
}

const mapStateToProps = state => ({
  user: state.user.user,
  users: state.user.users,
  isFetching: state.user.isFetching,
});

const mapDispatchToProps = dispatch => ({
  doReadUsers: payload => {
    dispatch(readUsers(payload));
  },
  doUpdateUser: payload => {
    dispatch(updateUser(payload));
  },
  doDeleteUser: payload => {
    dispatch(deleteUser(payload));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsersScene);

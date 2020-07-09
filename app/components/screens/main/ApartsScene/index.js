import React from 'react';
import { View, Text, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { UIActivityIndicator } from 'react-native-indicators';
import { EventRegister } from 'react-native-event-listeners';
import { connect } from 'react-redux';
import { readAparts, deleteApart } from 'store/apart/actions';
import ApartListItem from 'views/ApartListItem';
import FilterModal from 'views/FilterModal';
import ImageButton from 'views/ImageButton';
import { events } from 'app.json';
import styles from './styles';

class ApartsScene extends React.Component {
  state = {
    skip: 0,
    isLoading: false,
    options: [
      {
        index: 0,
        label: 'Floor Area Size',
        key: 'areaSize',
        filtered: false,
        min: 0,
        max: 9999,
      },
      {
        index: 1,
        label: 'Price Per Month',
        key: 'price',
        filtered: false,
        min: 0,
        max: 9999,
      },
      {
        index: 2,
        label: 'Number Of Rooms',
        key: 'roomCount',
        filtered: false,
        min: 0,
        max: 9999,
      },
      false,
    ],
  };

  componentDidMount = () => {
    const { navigation, doReadAparts, index } = this.props;
    if (index !== 0) {
      doReadAparts({ skip: 0, navigation, index });
    }
    EventRegister.addEventListener(events.SAFE, () => (this.safeToLoad = true));
    EventRegister.addEventListener(
      events.UNSAFE,
      () => (this.safeToLoad = false),
    );
  };

  componentWillUnmount = () => EventRegister.removeAllListeners();

  UNSAFE_componentWillReceiveProps = nextProp => {
    const { aparts } = nextProp;
    this.setState({ skip: aparts.length, isLoading: false });
  };

  closeRows = () => this.swipeListView.safeCloseOpenRow();

  onLoadMore = () => {
    const { skip, isLoading } = this.state;
    const { doReadAparts, navigation, index } = this.props;

    if (isLoading || !this.safeToLoad) {
      return;
    }

    this.setState({ isLoading: true }, () => {
      doReadAparts({ skip, navigation, index });
    });
  };

  viewApart = item => {
    this.closeRows();

    const { navigation } = this.props;
    navigation.navigate('ApartDetails', { item });
  };

  deleteApart = _id => {
    this.closeRows();

    const { doDeleteApart, navigation } = this.props;
    Alert.alert('Warning!', 'Are you sure to delete this apart?', [
      {
        text: 'NO',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: _ => doDeleteApart({ _id, navigation }),
        style: 'default',
      },
    ]);
  };

  render = () => {
    const { user, aparts, isLoading } = this.props;
    const { options } = this.state;

    let data = [...aparts];
    options.forEach(({ filtered, key, min, max }) => {
      if (filtered) {
        data = data.filter(x => x[key] >= min && x[key] <= max);
      }
    });
    if (options[3]) {
      data = data.filter(x => x.status);
    }

    return (
      <View style={styles.container}>
        {data.length > 0 ? (
          <SwipeListView
            ref={ref => (this.swipeListView = ref)}
            style={styles.container}
            data={data}
            renderItem={({ item }) => <ApartListItem item={item} />}
            renderHiddenItem={({ item }) => (
              <View style={styles.rowActions}>
                <ImageButton
                  small
                  source={require('assets/View.png')}
                  action={() => this.viewApart(item)}
                />
                {user.role !== 1 && (
                  <ImageButton
                    small
                    style={styles.rowAction}
                    source={require('assets/Delete.png')}
                    action={() => this.deleteApart(item._id)}
                  />
                )}
              </View>
            )}
            ListFooterComponent={
              <View style={styles.footer}>
                <Text>--- No more apartments ---</Text>
              </View>
            }
            disableRightSwipe
            closeOnRowBeginSwipe
            closeOnRowOpen
            rightOpenValue={user.role === 1 ? -40 : -80}
            keyExtractor={(_, index) => '' + index}
            onEndReached={this.onLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
          />
        ) : (
          <Text style={styles.none}>No apartments matching filters</Text>
        )}
        <FilterModal
          ref={ref => (this.filterModal = ref)}
          action={query => this.setState({ options: query })}
        />
        <ImageButton
          style={styles.filter}
          imageStyle={styles.filterImage}
          source={require('assets/Filter.png')}
          action={() => this.filterModal.show(options, user.role)}
        />
        {isLoading && (
          <View style={styles.indicator}>
            <UIActivityIndicator style={styles.indicator} color="dodgerblue" />
          </View>
        )}
      </View>
    );
  };
}

const mapStateToProps = state => ({
  user: state.user.user,
  aparts: state.apart.aparts,
});

const mapDispatchToProps = dispatch => ({
  doReadAparts: payload => {
    dispatch(readAparts(payload));
  },
  doDeleteApart: payload => {
    dispatch(deleteApart(payload));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApartsScene);

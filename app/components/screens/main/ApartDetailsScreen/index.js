import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UIActivityIndicator } from 'react-native-indicators';
import { EventRegister } from 'react-native-event-listeners';
import MapView, { Marker } from 'react-native-maps';
import CheckBox from 'react-native-circle-checkbox';
import PlacesInput from 'react-native-places-input';
import opencage from 'opencage-api-client';
import { connect } from 'react-redux';
import { createApart, updateApart } from 'store/apart/actions';
import NavHeader from 'views/NavHeader';
import FloatingInput from 'views/FloatingInput';
import validator from 'models';
import { GOOGLE_API_KEY, OCD_API_KEY, events } from 'app.json';
import styles from './styles';
const screenSize = Dimensions.get('screen');

class ApartDetailsScreen extends React.Component {
  constructor(props) {
    super(props);

    let item = null;
    if (props.route.params) {
      item = props.route.params.item;
    }

    this.state = {
      showPicker: false,
      isEditing: !item || false,
      item,
      name: item ? item.name : '',
      description: item ? item.description : '',
      areaSize: item ? item.areaSize : '',
      price: item ? item.price : '',
      roomCount: item ? item.roomCount : '',
      status: item ? item.status : true,
      latitude: item ? item.latitude : 1.379883,
      longitude: item ? item.longitude : 103.744178,
      errors: new Array(5).fill(null),
      region: {
        latitude: item ? item.latitude : 1.379883,
        longitude: item ? item.longitude : 103.744178,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      address: 'Loading ...',
    };

    this.setAddress(this.state.latitude, this.state.longitude);
  }

  UNSAFE_componentWillReceiveProps = nextProp => {
    const { error, isFetching } = nextProp;
    if (!isFetching && !error) {
      const { navigation } = this.props;
      const { isEditing, item } = this.state;
      if (!item) {
        navigation.goBack();
      } else {
        setTimeout(() => this.setState({ isEditing: !isEditing }), 300);
      }
    }
  };

  componentDidMount = () => EventRegister.emit(events.UNSAFE);
  componentWillUnmount = () => EventRegister.emit(events.SAFE);

  setAddress = (lat, lng, cb) => {
    opencage
      .geocode({ key: OCD_API_KEY, q: '' + lat + ' ' + lng })
      .then(data =>
        this.setState(
          {
            latitude: lat,
            longitude: lng,
            address:
              data.results.length > 0
                ? data.results[0].formatted
                : 'Unable to get address',
          },
          cb && cb,
        ),
      )
      .catch(_ =>
        this.setState({ address: 'Unable to get address' }, cb && cb),
      );
  };

  rightAction = shouldSave => {
    const { isEditing, item } = this.state;
    const { navigation } = this.props;

    if (shouldSave) {
      const { doCreateApart, doUpdateApart } = this.props;
      const {
        name,
        description,
        areaSize,
        price,
        roomCount,
        status,
        latitude,
        longitude,
      } = this.state;
      const params = {
        name,
        description,
        areaSize,
        price,
        roomCount,
        latitude,
        longitude,
      };

      if (!item) {
        doCreateApart({ ...params, navigation });
      } else {
        doUpdateApart({ ...params, status, _id: item._id, navigation });
      }
    } else {
      Alert.alert('Warning!', 'Discard changes?', [
        {
          text: 'NO',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: _ =>
            item
              ? this.setState({ isEditing: !isEditing })
              : navigation.goBack(),
          style: 'default',
        },
      ]);
    }
  };

  pickPlace = coordinate => {
    const { latitude, longitude, lat, lng } = coordinate;
    const {
      region: { latitudeDelta, longitudeDelta },
    } = this.state;

    this.setAddress(latitude || lat, longitude || lng, () => {
      this.setState(
        {
          region: {
            latitude: latitude || lat,
            longitude: longitude || lng,
            latitudeDelta,
            longitudeDelta,
          },
          showPicker: false,
        },
        () =>
          this.mapView.animateToRegion(
            {
              latitude: latitude || lat,
              longitude: longitude || lng,
              latitudeDelta,
              longitudeDelta,
            },
            1000,
          ),
      );
    });
  };

  showAlert = () => {
    const {
      name,
      description,
      areaSize,
      price,
      roomCount,
      latitude,
      longitude,
    } = this.state;
    const options = [
      { key: 'name', value: name },
      { key: 'description', value: description },
      { key: 'areaSize', value: areaSize },
      { key: 'price', value: price },
      { key: 'roomCount', value: roomCount },
      { key: 'latitude', value: latitude },
      { key: 'longitude', value: longitude },
    ];
    let isValid = true;
    options.forEach(option => {
      if (!isValid) {
        return;
      }
      const error = validator(option.key, option.value);
      if (error) {
        isValid = false;
        Alert.alert('Validation Error', error);
      }
    });
  };

  render = () => {
    const {
      item,
      isEditing,
      name,
      description,
      areaSize,
      price,
      roomCount,
      status,
      region,
      latitude,
      longitude,
      address,
      showPicker,
      errors,
    } = this.state;
    const { navigation, isFetching } = this.props;
    const options = [
      {
        index: 0,
        label: 'Name',
        key: 'name',
        value: name,
        keyboardType: 'ascii-capable',
        number: false,
      },
      {
        index: 1,
        label: 'Description',
        key: 'description',
        value: description,
        keyboardType: 'ascii-capable',
        number: false,
      },
      {
        index: 2,
        label: 'Floor Area Size',
        key: 'areaSize',
        value: areaSize,
        keyboardType:
          Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric',
        number: true,
      },
      {
        index: 3,
        label: 'Price Per Month',
        key: 'price',
        value: price,
        keyboardType:
          Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric',
        number: true,
      },
      {
        index: 4,
        label: 'Number Of Rooms',
        key: 'roomCount',
        value: roomCount,
        keyboardType:
          Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric',
        number: true,
      },
    ];
    const radioProps = {
      outerColor: 'dodgerblue',
      filterColor: '#EEE',
      innerColor: 'dodgerblue',
    };
    const markerRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    const disabled =
      validator('name', name) ||
      validator('description', description) ||
      validator('areaSize', areaSize) ||
      validator('price', price) ||
      validator('roomCount', roomCount) ||
      validator('latitude', latitude) ||
      validator('longitude', longitude);

    return (
      <SafeAreaView style={styles.container}>
        <NavHeader
          type={!isEditing ? 3 : item ? 4 : 5}
          leftAction={() => this.rightAction(false)}
          rightAction={
            !isEditing
              ? () => this.setState({ isEditing: !isEditing })
              : [
                  () => (disabled ? this.showAlert() : this.rightAction(true)),
                  () => this.rightAction(false),
                ]
          }
          navigation={navigation}
        />
        <ScrollView contentContainerStyle={styles.content}>
          {options.map(option =>
            isEditing ? (
              <FloatingInput
                key={option.key}
                value={`${option.value}`}
                placeholder={option.label}
                keyboardType={option.keyboardType}
                autoCapitalize="none"
                error={errors[option.index]}
                onChangeText={text => {
                  let newValue = option.number
                    ? parseFloat(text.trim())
                    : text.trim();
                  if (option.number && isNaN(newValue)) {
                    newValue = 0;
                  }
                  this.setState({ [option.key]: newValue });
                }}
                onFocus={() =>
                  this.setState({
                    errors: errors.map(
                      (x, index) => index !== option.index && x,
                    ),
                  })
                }
                onBlur={() =>
                  this.setState({
                    errors: errors.map((x, index) =>
                      index === option.index
                        ? validator(
                            option.index === 0 ? 'name' : option.key,
                            option.value,
                          )
                        : x,
                    ),
                  })
                }
              />
            ) : (
              <View key={option.key} style={styles.row}>
                <Text style={styles.label}>{option.label}</Text>
                <Text style={styles.text}>{option.value}</Text>
              </View>
            ),
          )}
          {item && (
            <View style={styles.row}>
              <Text style={styles.label}>Rental Status</Text>
              <CheckBox
                {...radioProps}
                checked={status}
                onToggle={checked =>
                  isEditing && this.setState({ status: checked })
                }
              />
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.addrLabel}>Address</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                isEditing
                  ? this.setState({ showPicker: true })
                  : this.setState({ region: markerRegion })
              }
            >
              <Text style={styles.addrText}>{address}</Text>
            </TouchableOpacity>
          </View>
          <MapView
            ref={ref => (this.mapView = ref)}
            style={styles.map}
            region={region}
            onRegionChange={newRegion => this.setState({ region: newRegion })}
            zoomTapEnabled
            zoomEnabled
            zoomControlEnabled
            onPress={e => isEditing && this.pickPlace(e.nativeEvent.coordinate)}
          >
            <Marker coordinate={markerRegion} />
          </MapView>
        </ScrollView>
        {showPicker && (
          <View style={styles.addrView}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={screenSize}
              onPress={() => this.setState({ showPicker: false })}
            />
            <PlacesInput
              stylesContainer={styles.addrInput}
              googleApiKey={GOOGLE_API_KEY}
              placeHolder="Type your apartment address here ..."
              onSelect={({ error_message, result }) => {
                if (!result) {
                  Alert.alert('Google Place API Error', error_message);
                  this.setState({ showPicker: false });
                } else {
                  this.pickPlace(result.geometry.location);
                }
              }}
            />
          </View>
        )}
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
  isFetching: state.apart.isFetching,
  error: state.apart.error,
});

const mapDispatchToProps = dispatch => ({
  doCreateApart: payload => {
    dispatch(createApart(payload));
  },
  doUpdateApart: payload => {
    dispatch(updateApart(payload));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApartDetailsScreen);

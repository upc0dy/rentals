import { Alert } from 'react-native';
import Axios from 'axios';
import moment from 'moment';
import { put, takeLatest, select } from 'redux-saga/effects';
import { UserActions } from '../actionTypes';
import * as Actions from './actions';

const BASE_URL = 'http://192.168.1.55:5000/api/';

export function* loginUser({ payload }) {
  try {
    const { navigation, type, ...params } = payload;
    const res = yield Axios.get(
      BASE_URL + 'auth/' + (type ? type.toLowerCase() : 'login'),
      { params },
    );
    yield put(
      Actions.authUserSuccess(
        {
          ...res.data.user,
          password: params.password,
        },
        res.data.token,
        res.data.accountType,
      ),
    );
    navigation.navigate('Home');
  } catch (e) {
    Alert.alert(
      `${payload.type ? payload.type + ' ' : ''}Login Failure`,
      e.response ? e.response.data.message : 'Server not running',
    );
    yield put(Actions.authUserError());
  }
}

export function* registerUser({ payload }) {
  try {
    const { navigation, ...params } = payload;
    const res = yield Axios.post(BASE_URL + 'auth/register', params);
    if (res.data.user) {
      yield put(
        Actions.authUserSuccess(
          {
            ...res.data.user,
            password: params.password,
          },
          res.data.token,
          res.data.type,
        ),
      );
      navigation.navigate('Home');
    } else {
      Alert.alert('Registration Success', res.data.message);
      yield put(Actions.authUserError());
      navigation.goBack();
    }
  } catch (e) {
    Alert.alert(
      'Registration Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    yield put(Actions.authUserError());
  }
}

export function* logoutUser({ navigation }) {
  yield put(Actions.resetUser());
  navigation.popToTop();
}

export function* createUser({ payload }) {
  try {
    const { users, token } = yield select(state => state.user);
    const { navigation, ...params } = payload;

    const res = yield Axios.post(BASE_URL + 'users', params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(
      Actions.actionUserSuccess(
        [...users, res.data.user].sort((x1, x2) =>
          moment(x1.createdAt).isBefore(x2.createdAt)
            ? 1
            : moment(x1.createdAt).isAfter(x2.createdAt)
            ? -1
            : 0,
        ),
      ),
    );
  } catch (e) {
    Alert.alert(
      'User Create Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(Actions.resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionUserError());
    }
  }
}

export function* readUsers({ payload }) {
  try {
    const { token } = yield select(state => state.user);
    const res = yield Axios.get(BASE_URL + 'users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(Actions.actionUserSuccess(res.data.users));
  } catch (e) {
    Alert.alert(
      'User Read Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(Actions.resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionUserError());
    }
  }
}

export function* updateUser({ payload }) {
  try {
    const { users, token } = yield select(state => state.user);
    const { navigation, _id, ...params } = payload;

    const res = yield Axios.put(BASE_URL + 'users/' + _id, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(
      Actions.actionUserSuccess(
        users
          .map(x => (x._id !== _id ? x : res.data.user))
          .sort((x1, x2) =>
            moment(x1.createdAt).isBefore(x2.createdAt)
              ? 1
              : moment(x1.createdAt).isAfter(x2.createdAt)
              ? -1
              : 0,
          ),
      ),
    );
  } catch (e) {
    Alert.alert(
      'User Update Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(Actions.resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionUserError());
    }
  }
}

export function* deleteUser({ payload }) {
  try {
    const { users, token } = yield select(state => state.user);
    const { _id } = payload;

    yield Axios.delete(BASE_URL + 'users/' + _id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(Actions.actionUserSuccess(users.filter(x => x._id !== _id)));
  } catch (e) {
    Alert.alert(
      'User Delete Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(Actions.resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionUserError());
    }
  }
}

export function* inviteUser({ payload }) {
  try {
    const { users, token } = yield select(state => state.user);
    const { navigation, ...params } = payload;

    const res = yield Axios.get(BASE_URL + 'user/invite', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Alert.alert('Success', res.data.message);
    yield put(Actions.actionUserSuccess(users));
  } catch (e) {
    Alert.alert(
      'User Invite Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(Actions.resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionUserError());
    }
  }
}

export function* uploadAvatar({ payload }) {
  try {
    const { user, token } = yield select(state => state.user);
    const { uri } = payload;

    const data = new FormData();
    data.append('avatar', {
      name: 'avatar.jpg',
      type: 'image/jpeg',
      uri,
    });

    const res = yield Axios.put(BASE_URL + 'user/upload', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(
      Actions.authUserSuccess({
        ...res.data.user,
        password: user.password,
      }),
    );
    Alert.alert('Success', 'Avatar uploaded successfully');
  } catch (e) {
    Alert.alert(
      'Avatar Upload Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(Actions.resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionUserError());
    }
  }
}

export default function*() {
  yield takeLatest(UserActions.LOGIN_USER, loginUser);
  yield takeLatest(UserActions.REGISTER_USER, registerUser);
  yield takeLatest(UserActions.LOGOUT_USER, logoutUser);
  yield takeLatest(UserActions.CREATE_USER, createUser);
  yield takeLatest(UserActions.READ_USERS, readUsers);
  yield takeLatest(UserActions.UPDATE_USER, updateUser);
  yield takeLatest(UserActions.DELETE_USER, deleteUser);
  yield takeLatest(UserActions.INVITE_USER, inviteUser);
  yield takeLatest(UserActions.UPLOAD_AVATAR, uploadAvatar);
}

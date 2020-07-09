import { put, takeLatest, select } from 'redux-saga/effects';
import { Alert } from 'react-native';
import Axios from 'axios';
import moment from 'moment';
import { ApartActions } from '../actionTypes';
import { resetUser } from '../user/actions';
import * as Actions from './actions';

const BASE_URL = 'http://192.168.1.55:5000/api/';

export function* createApart({ payload }) {
  try {
    const {
      user: { token },
      apart: { aparts },
    } = yield select(state => state);
    const { navigation, ...params } = payload;

    const res = yield Axios.post(BASE_URL + 'aparts', params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(
      Actions.actionApartSuccess(
        [...aparts, res.data.apart].sort((x1, x2) =>
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
      'Apart Create Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionApartError());
    }
  }
}

export function* readAparts({ payload }) {
  try {
    const {
      user: { token },
      apart: { aparts },
    } = yield select(state => state);
    const { skip } = payload;
    const res = yield Axios.get(BASE_URL + 'aparts', {
      params: { skip },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(
      Actions.actionApartSuccess(
        (skip > 0 ? [...aparts, ...res.data.aparts] : res.data.aparts).sort(
          (x1, x2) =>
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
      'Apart Read Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionApartError());
    }
  }
}

export function* updateApart({ payload }) {
  try {
    const {
      user: { token },
      apart: { aparts },
    } = yield select(state => state);
    const { navigation, _id, ...params } = payload;

    const res = yield Axios.put(BASE_URL + 'aparts/' + _id, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(
      Actions.actionApartSuccess(
        aparts
          .map(x => (x._id !== _id ? x : res.data.apart))
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
      'Apart Update Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionApartError());
    }
  }
}

export function* deleteApart({ payload }) {
  try {
    const {
      user: { token },
      apart: { aparts },
    } = yield select(state => state);
    const { _id } = payload;

    yield Axios.delete(BASE_URL + 'aparts/' + _id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(Actions.actionApartSuccess(aparts.filter(x => x._id !== _id)));
  } catch (e) {
    Alert.alert(
      'Apart Delete Failure',
      e.response ? e.response.data.message : 'Server not running',
    );
    if (e.response && e.response.status === 401) {
      yield put(resetUser());
      payload.navigation.popToTop();
    } else {
      yield put(Actions.actionApartError());
    }
  }
}

export default function*() {
  yield takeLatest(ApartActions.CREATE_APART, createApart);
  yield takeLatest(ApartActions.READ_APARTS, readAparts);
  yield takeLatest(ApartActions.UPDATE_APART, updateApart);
  yield takeLatest(ApartActions.DELETE_APART, deleteApart);
}

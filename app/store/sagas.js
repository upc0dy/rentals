import { fork } from 'redux-saga/effects';
import userSaga from './user/saga';
import apartSaga from './apart/saga';

export default function* root() {
  yield fork(userSaga);
  yield fork(apartSaga);
}

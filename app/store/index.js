import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import user from './user/reducer';
import apart from './apart/reducer';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({ user, apart });

export default () => {
  let middleware = [];
  const enhancers = [];

  const sagaMiddleware = createSagaMiddleware();
  middleware = [sagaMiddleware];
  enhancers.push(applyMiddleware(...middleware));

  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(...middleware),
      global.reduxNativeDevTools
        ? global.reduxNativeDevTools({ name: 'FirstDerm' })
        : nope => nope,
    ),
  );
  sagaMiddleware.run(rootSaga);
  const persistor = persistStore(store);

  return { store, persistor };
};

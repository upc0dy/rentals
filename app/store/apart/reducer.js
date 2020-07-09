import { ApartActions } from '../actionTypes';

const INITIAL_STATE = {
  aparts: [],
  isFetching: false,
  error: false,
};

const LOADING_REDUCER = state => ({
  ...state,
  isFetching: true,
  error: false,
});

const apartReducer = {
  [ApartActions.CREATE_APART]: LOADING_REDUCER,
  [ApartActions.READ_APARTS]: LOADING_REDUCER,
  [ApartActions.UPDATE_APART]: LOADING_REDUCER,
  [ApartActions.DELETE_APART]: LOADING_REDUCER,
  [ApartActions.ACTION_APART_SUCCESS]: (state, { aparts }) => ({
    ...state,
    aparts,
    isFetching: false,
    error: false,
  }),
  [ApartActions.ACTION_APART_ERROR]: state => ({
    ...state,
    isFetching: false,
    error: true,
  }),
  [ApartActions.RESET_APART]: _ => ({
    aparts: [],
    isFetching: false,
    error: false,
  }),
};

const createReducer = (initialState, reducers) => (
  state = initialState,
  action,
) => {
  const reducer = reducers[action.type];
  return reducer ? reducer(state, action) : state;
};

export default createReducer(INITIAL_STATE, apartReducer);

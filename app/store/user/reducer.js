import { UserActions } from '../actionTypes';

const INITIAL_STATE = {
  user: null,
  users: [],
  isFetching: false,
  error: false,
};

const LOADING_REDUCER = state => ({
  ...state,
  isFetching: true,
  error: false,
});

const userReducer = {
  [UserActions.LOGIN_USER]: state => ({
    ...state,
    user: null,
    isFetching: true,
    error: false,
  }),
  [UserActions.REGISTER_USER]: state => ({
    ...state,
    user: null,
    isFetching: true,
    error: false,
  }),
  [UserActions.LOGOUT_USER]: _ => ({
    user: null,
    users: [],
    token: null,
    isFetching: false,
    error: false,
  }),
  [UserActions.AUTH_USER_SUCCESS]: (state, { user, token, accountType }) =>
    token
      ? {
          ...state,
          user,
          users: [],
          token,
          accountType,
          isFetching: false,
          error: false,
        }
      : {
          ...state,
          user,
          users: [],
          isFetching: false,
          error: false,
        },
  [UserActions.AUTH_USER_ERROR]: state => ({
    ...state,
    token: null,
    isFetching: false,
    error: true,
  }),
  [UserActions.CREATE_USER]: LOADING_REDUCER,
  [UserActions.READ_USERS]: LOADING_REDUCER,
  [UserActions.UPDATE_USER]: LOADING_REDUCER,
  [UserActions.DELETE_USER]: LOADING_REDUCER,
  [UserActions.INVITE_USER]: LOADING_REDUCER,
  [UserActions.UPLOAD_AVATAR]: LOADING_REDUCER,
  [UserActions.ACTION_USER_SUCCESS]: (state, { users }) => ({
    ...state,
    users,
    isFetching: false,
    error: false,
  }),
  [UserActions.ACTION_USER_ERROR]: state => ({
    ...state,
    isFetching: false,
    error: true,
  }),
  [UserActions.RESET_USER]: _ => ({
    user: null,
    users: [],
    token: null,
    accountType: null,
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

export default createReducer(INITIAL_STATE, userReducer);

import { UserActions } from '../actionTypes';

export const loginUser = payloadData => ({
  type: UserActions.LOGIN_USER,
  payload: payloadData,
});

export const registerUser = payloadData => ({
  type: UserActions.REGISTER_USER,
  payload: payloadData,
});

export const logoutUser = navigation => ({
  type: UserActions.LOGOUT_USER,
  navigation,
});

export const authUserSuccess = (user, token, accountType) => ({
  type: UserActions.AUTH_USER_SUCCESS,
  user,
  token,
  accountType,
});

export const authUserError = _ => ({
  type: UserActions.AUTH_USER_ERROR,
});

export const createUser = payloadData => ({
  type: UserActions.CREATE_USER,
  payload: payloadData,
});

export const readUsers = payloadData => ({
  type: UserActions.READ_USERS,
  payload: payloadData,
});

export const updateUser = payloadData => ({
  type: UserActions.UPDATE_USER,
  payload: payloadData,
});

export const deleteUser = payloadData => ({
  type: UserActions.DELETE_USER,
  payload: payloadData,
});

export const inviteUser = payloadData => ({
  type: UserActions.INVITE_USER,
  payload: payloadData,
});

export const uploadAvatar = payloadData => ({
  type: UserActions.UPLOAD_AVATAR,
  payload: payloadData,
});

export const actionUserSuccess = users => ({
  type: UserActions.ACTION_USER_SUCCESS,
  users,
});

export const actionUserError = _ => ({
  type: UserActions.ACTION_USER_ERROR,
});

export const resetUser = _ => ({
  type: UserActions.RESET_USER,
});

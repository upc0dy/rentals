import { ApartActions } from '../actionTypes';

export const createApart = payloadData => ({
  type: ApartActions.CREATE_APART,
  payload: payloadData,
});

export const readAparts = payloadData => ({
  type: ApartActions.READ_APARTS,
  payload: payloadData,
});

export const updateApart = payloadData => ({
  type: ApartActions.UPDATE_APART,
  payload: payloadData,
});

export const deleteApart = payloadData => ({
  type: ApartActions.DELETE_APART,
  payload: payloadData,
});

export const actionApartSuccess = aparts => ({
  type: ApartActions.ACTION_APART_SUCCESS,
  aparts,
});

export const actionApartError = _ => ({
  type: ApartActions.ACTION_APART_ERROR,
});

export const resetApart = _ => ({
  type: ApartActions.RESET_APART,
});

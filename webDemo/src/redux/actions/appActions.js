import { createAction } from 'redux-actions';
import { PROVENANCE_API_ACCOUNT_ATTRIBUTES } from 'consts';
import { ajaxGet } from './xhrActions';

// Vars
// - Store
export const SET_ADDRESS = 'APP::SET_ADDRESS';
export const SET_PEER = 'APP::SET_PEER';
export const SET_CONNECTOR = 'APP::SET_CONNECTOR';
export const RESET_WALLETCONNECT_STORE = 'APP::RESET_WALLETCONNECT_STORE';
export const SET_SIGN_PENDING = 'APP::SET_SIGN_PENDING';
export const SET_SEND_PENDING = 'APP::SET_SEND_PENDING';
// - API
export const GET_ACCOUNT_ASSETS = 'APP:GET_ACCOUNT_ASSETS';
export const GET_WALLET_KYC = 'APP:GET_WALLET_KYC';

// Actions
// - Store
export const setAddress = createAction(SET_ADDRESS);
export const setPeer = createAction(SET_PEER);
export const setConnector = createAction(SET_CONNECTOR);
export const resetWalletConnectStore = createAction(RESET_WALLETCONNECT_STORE);
export const setSignPending = createAction(SET_SIGN_PENDING);
export const setSendPending = createAction(SET_SEND_PENDING);

export const getWalletKYC = (address) => async (dispatch) => (
  ajaxGet(
    GET_WALLET_KYC,
    dispatch,
    `${PROVENANCE_API_ACCOUNT_ATTRIBUTES}/${address}`,
  )
);

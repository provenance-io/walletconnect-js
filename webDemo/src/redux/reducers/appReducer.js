import { handleActions } from 'redux-actions';
import {
  SET_ADDRESS,
  SET_PEER,
  SET_CONNECTOR,
  SET_SIGN_PENDING,
  SET_SEND_PENDING,
  RESET_WALLETCONNECT_STORE,
  GET_ACCOUNT_ASSETS,
  GET_WALLET_KYC,
} from '../actions/appActions';
import { SUCCESS, REQUEST, FAILURE } from '../actions/xhrActions';

export const initialState = {
  connector: null,
  address: '',
  publicKey: '',
  peer: {},
  signPending: false,
  sendPending: false,
  assetsPending: false,
  assets: [],
  KYCStatus: '',
  KYCStatusLoading: false,
};

const reducer = handleActions(
  {
    /* -------------------------
    GET_WALLET_KYC
    ------------------------- */
    [`${GET_WALLET_KYC}_${REQUEST}`](state) {
      return {
        ...state,
        KYCStatusLoading: true,
        KYCStatus: '',
        error: null,
      };
    },
    [`${GET_WALLET_KYC}_${SUCCESS}`](state, { payload = {} }) {
      const { attributes = [] } = payload;
      const KYCStatus = attributes.filter(({ name }) => name.includes('kyc-aml')).length ? 'KYC Approved!' : 'Non-KYC Account';
      
      return {
        ...state,
        KYCStatusLoading: false,
        KYCStatus,
      };
    },
    [`${GET_WALLET_KYC}_${FAILURE}`](state, { payload }) {
      return {
        ...state,
        KYCStatusLoading: false,
        KYCStatus: '',
        error: payload,
      };
    },
    /* -------------------------
    GET_ACCOUNT_ASSETS
    ------------------------- */
    [`${GET_ACCOUNT_ASSETS}_${REQUEST}`](state) {
      return {
        ...state,
        assetsPending: true,
        error: null,
      };
    },
    [`${GET_ACCOUNT_ASSETS}_${SUCCESS}`](state, { payload }) {
      const { balances: assets } = payload;
      
      return {
        ...state,
        assetsPending: false,
        assets,
      };
    },
    [`${GET_ACCOUNT_ASSETS}_${FAILURE}`](state, { payload }) {
      return {
        ...state,
        assetsPending: false,
        error: payload,
      };
    },
    /* -------------------------
    SET_CONNECTOR
    ------------------------- */
    [SET_CONNECTOR](state, { payload: connector }) {
      const { _peerMeta: peer, _accounts: accounts } = connector;
      const [address, publicKey] = accounts;

      return {
        ...state,
        connector,
        address,
        publicKey,
        peer,
      };
    },
    /* -------------------------
    SET_ADDRESS
    ------------------------- */
    [SET_ADDRESS](state, { payload: accounts }) {
      const [address, publicKey] = accounts;

      return {
        ...state,
        address,
        publicKey,
      };
    },
    /* -------------------------
    SET_PEER
    ------------------------- */
    [SET_PEER](state, { payload: peer }) {

      return {
        ...state,
        peer
      };
    },
    /* -------------------------
    RESET_WALLETCONNECT_STORE
    ------------------------- */
    [RESET_WALLETCONNECT_STORE](state) {
      return {
        ...initialState,
      };
    },
    /* -------------------------
    SET_SIGN_PENDING
    ------------------------- */
    [SET_SIGN_PENDING](state, { payload: signPending }) {
      return {
        ...state,
        signPending,
      };
    },
    /* -------------------------
    SET_SEND_PENDING
    ------------------------- */
    [SET_SEND_PENDING](state, { payload: sendPending }) {
      return {
        ...state,
        sendPending,
      };
    },
  },
  initialState
);

export default reducer;

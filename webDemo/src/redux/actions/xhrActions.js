import _axios from 'axios';
import { createAction } from 'redux-actions';

export const axios = _axios.create({
  baseURL: window.location.hostname,
  timeout: 45000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

function errorHandling(error) {
  if (error.response) {
    return error.response.data;
  }

  if (error.request) {
    console.error(`Unexpected request error ${error.request}`, error); // eslint-disable-line no-console
  }

  // eslint-disable-next-line no-console
  console.error(`Something happened setting up the request ${error.message}`, error);
  return null;
}

export const ajaxGet = async (action, dispatch, url, config = null, meta = null) => {
  dispatch(createAction(`${action}_${REQUEST}`)());

  try {
    const result = await axios.get(url, config);

    dispatch(createAction(`${action}_${SUCCESS}`, null, () => ({ responseHeaders: { ...result.headers }, ...meta }))(result.data));

    return Promise.resolve(result);
  } catch (error) {
    dispatch(createAction(`${action}_${FAILURE}`)(errorHandling(error)));

    return Promise.reject(error.response);
  }
};

export const ajaxPost = async (action, dispatch, url, data, config = null) => {
  dispatch(createAction(`${action}_${REQUEST}`)());

  try {
    const result = await axios.post(url, data, config);

    dispatch(createAction(`${action}_${SUCCESS}`, null, () => ({ responseHeaders: { ...result.headers }, ...data }))(result.data));

    return Promise.resolve(result.data);
  } catch (error) {
    dispatch(createAction(`${action}_${FAILURE}`)(errorHandling(error)));

    return Promise.reject(error.response);
  }
};

export const ajaxPut = async (action, dispatch, url, data, config = null) => {
  dispatch(createAction(`${action}_${REQUEST}`)());

  try {
    const result = await axios.put(url, data, config);

    dispatch(createAction(`${action}_${SUCCESS}`, null, () => ({ responseHeaders: { ...result.headers }, ...data }))(result.data));

    return Promise.resolve(result.data);
  } catch (error) {
    dispatch(createAction(`${action}_${FAILURE}`)(errorHandling(error)));

    return Promise.reject(error.response);
  }
};

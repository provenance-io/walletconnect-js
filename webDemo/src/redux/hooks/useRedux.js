import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import isEqual from 'react-fast-compare';

/**
 * use redux
 *
 * @param {string} reducer - the name of the reducer to use
 * @param {object} actionList - object of action functions
 */
export const useRedux = (reducer, actionList) => {
  if (!reducer || !actionList) {
    throw new Error('useRedux requires a reducer and list of actions');
  }

  const dispatch = useDispatch();
  // get all the state out of the reducer and memoize it real good
  const mReducer = useMemo(() => reducer, [reducer]);
  const state = useSelector((newState) => newState[mReducer], isEqual);
  // get all the actions and wrap them in dispatch
  const actions = useMemo(() => bindActionCreators(actionList, dispatch), [dispatch, actionList]);

  return {
    ...state,
    ...actions,
  };
};

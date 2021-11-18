import { useRedux } from './useRedux';
import { appActions } from '../actions';

export const useApp = () => useRedux('appReducer', appActions);


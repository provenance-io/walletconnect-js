import React from 'react'; //eslint-disable-line
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux'; //eslint-disable-line
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { useRedux } from './useRedux';

const mockStore = configureMockStore([thunk]);
const store = mockStore({ testReducer: { status: 'success', uuid: '909f767e-e48a-493a-9b4f-0ba6ddba9c8b' } });
const wrapper = (props) => <Provider store={store} {...props} />;

describe('hooks: useRedux', () => {
  it('should return the state from testReducer', () => {
    const { result } = renderHook(() => useRedux('testReducer', {}), { wrapper });
    expect(result.current.status).toBe('success');
    expect(result.current.uuid).toBe('909f767e-e48a-493a-9b4f-0ba6ddba9c8b');
  });

  it('should return actions wrapped in dispatch', () => {
    const { result } = renderHook(
      () =>
        useRedux('fakeReducer', {
          setCount: (payload) => ({
            type: 'FOO',
            payload,
          }),
        }),
      { wrapper }
    );
    expect(typeof result.current.setCount).toBe('function');
    expect(result.current.setCount()).toEqual({ type: 'FOO' });
    expect(result.current.setCount('bar')).toEqual({ type: 'FOO', payload: 'bar' });
  });

  it('should handle not being given a reducer', () => {
    expect(() => useRedux(undefined, {})).toThrow('useRedux requires a reducer and list of actions');
  });

  it('should handle not being given actions', () => {
    expect(() => useRedux('reducer')).toThrow('useRedux requires a reducer and list of actions');
  });
});

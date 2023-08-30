import { getChangedFields } from '../../utils/getChangedFields';

const NEW_OBJ = {
  wallet: {
    address: '123456',
    publicKey: 'abcdefg',
  },
  connection: { status: 'connected' },
  modal: { open: false },
};
const OLD_OBJ = {
  wallet: {
    address: '9876543',
    publicKey: 'abcdefg',
  },
  connection: { status: 'disconnected' },
  modal: { open: false },
};
const CHANGED_RESULT = {
  wallet: {
    address: '123456',
  },
  connection: { status: 'connected' },
};
const TARGET_KEYS = [
  'wallet.address',
  'wallet.publicKey',
  'connection.status',
  'modal.open',
];

describe(`Find the changed object fields`, () => {
  it('Correct fields returned', () => {
    expect(JSON.stringify(getChangedFields(NEW_OBJ, OLD_OBJ, TARGET_KEYS))).toBe(
      JSON.stringify(CHANGED_RESULT)
    );
  });
});

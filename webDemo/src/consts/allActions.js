export const ALL_ACTIONS = [
  // ----------------------------------
  // Activate Request Method/Action
  // ----------------------------------
  {
    windowMessage: 'ACTIVATE_REQUEST',
    method: 'activateRequest',
    buttonTxt: 'Activate Request',
    fields: [
      {
        name: 'denom',
        label: 'Marker Denom',
        value: 'myNewMarker',
        placeholder: 'Enter Marker Denom',
      },
    ],
  },
  // ----------------------------------
  // Add Marker Method/Action
  // ----------------------------------
  {
    windowMessage: 'ADD_MARKER',
    method: 'addMarker',
    buttonTxt: 'Add Marker',
    fields: [
      {
        name: 'denom',
        label: 'Marker Denom',
        value: 'myNewMarker',
        placeholder: 'Enter Marker Denom',
        width: '80%',
      },
      {
        name: 'amount',
        label: 'Amount',
        value: '1',
        placeholder: 'Enter Marker Amount',
        width: '20%',
      },
    ],
  },
  // ------------------------------
  // Cancel Request Method/Action
  // ------------------------------
  {
    windowMessage: 'CANCEL_REQUEST',
    method: 'cancelRequest',
    buttonTxt: 'Cancel Request',
    fields: [
      {
        name: 'denom',
        label: 'Marker Denom',
        value: 'myNewMarker',
        placeholder: 'Enter Marker Denom',
      },
    ],
  },
  // ------------------------------
  // Custom Action Method/Action
  // ------------------------------
  {
    windowMessage: 'CUSTOM_ACTION',
    method: 'customAction',
    buttonTxt: 'Run Custom Action',
    json: true,
    fields: [
      {
        name: 'data',
        label: 'Custom Data',
        value: '',
        placeholder: 'Enter Custom Data',
      },
    ],
  },
  // ----------------------------------
  // Delegate Hash Method/Action
  // ----------------------------------
  {
    windowMessage: 'DELEGATE_HASH',
    method: 'delegateHash',
    buttonTxt: 'Delegate Hash',
    fields: [
      {
        name: 'validatorAddress',
        label: 'Delegate To',
        value: 'tpvaloper1tgq6cpu6hmsrvkvdu82j99tsxxw7qqajn843fe',
        placeholder: 'Enter Address',
        width: '80%',
      },
      {
        name: 'amount',
        label: 'Amount',
        value: '1',
        placeholder: 'Enter Delegation Amount',
        width: '20%',
      },
    ],
  },
  // ----------------------------------
  // Send Hash Method/Action
  // ----------------------------------
  {
    windowMessage: 'TRANSACTION',
    method: 'sendHash',
    buttonTxt: 'Send Hash',
    fields: [
      {
        name: 'to',
        label: 'Hash To',
        value: 'tp1vxlcxp2vjnyjuw6mqn9d8cq62ceu6lllpushy6',
        placeholder: 'Enter Address',
        width: '80%',
      },
      {
        name: 'amount',
        label: 'Amount',
        value: '10',
        placeholder: 'Enter Send Amount',
        width: '20%',
      },
    ],
  },
  // ------------------------------
  // Sign JWT Method/Action
  // ------------------------------
  {
    windowMessage: 'SIGN_JWT',
    method: 'signJWT',
    buttonTxt: 'Sign JWT',
  },
  // ----------------------------------
  // Sign Message Method/Action
  // ----------------------------------
  {
    windowMessage: 'SIGNATURE',
    method: 'signMessage',
    buttonTxt: 'Sign Message',
    fields: [
      {
        value: 'WalletConnect-JS | WebDemo | Sign Message',
        label: 'Message',
        placeholder: 'Enter Message',
        name: 'message',
      },
    ],
  },
  // ------------------------------
  // Write Record Method/Action
  // ------------------------------
  {
    windowMessage: 'WRITE_RECORD',
    method: 'writeRecord',
    buttonTxt: 'Write Record',
    json: true,
    fields: [
      {
        name: 'json',
        label: 'Full JSON (Optional)',
        value: '',
        placeholder: 'Optional full JSON',
      },
      {
        name: 'record',
        label: 'Record',
        value: '{}',
        placeholder: 'Enter Record',
      },
      {
        name: 'signersList',
        label: 'Signers List',
        value: '[]',
        placeholder: 'Enter Signers List',
      },
      {
        name: 'sessionIdComponents',
        label: 'Session Id Components',
        value: '{}',
        placeholder: 'Enter Session Id Components',
      },
      {
        name: 'contractSpecUuid',
        label: 'Contract Spec Uuid',
        value: '',
        placeholder: 'Enter Contract Spec Uuid',
      },
      {
        name: 'partiesList',
        label: 'Parties List',
        value: '[{}]',
        placeholder: 'Enter Parties List',
      },
    ],
  },
  // ------------------------------
  // Write Scope Method/Action
  // ------------------------------
  {
    windowMessage: 'WRITE_SCOPE',
    method: 'writeScope',
    buttonTxt: 'Write Scope',
    json: true,
    fields: [
      {
        name: 'json',
        label: 'Full JSON (Optional)',
        value: '',
        placeholder: 'Optional full JSON',
      },
      {
        name: 'scope',
        label: 'Scope',
        value: 'myScope',
        placeholder: 'Enter Scope',
      },
      {
        name: 'signersList',
        label: 'Signers List',
        value: '[]',
        placeholder: 'Enter Signers List',
      },
      {
        name: 'scopeUuid',
        label: 'Scope Uuid',
        value: '',
        placeholder: 'Enter Scope Uuid',
      },
      {
        name: 'specUuid',
        label: 'Spec Uuid',
        value: '',
        placeholder: 'Enter Spec Uuid',
      },
    ],
  },
  // ------------------------------
  // Write Session Method/Action
  // ------------------------------
  {
    windowMessage: 'WRITE_SESSION',
    method: 'writeSession',
    buttonTxt: 'Write Session',
    json: true,
    fields: [
      {
        name: 'json',
        label: 'Full JSON (Optional)',
        value: '',
        placeholder: 'Optional full JSON',
      },
      {
        name: 'session',
        label: 'Session',
        value: '{}',
        placeholder: 'Enter Session',
      },
      {
        name: 'signersList',
        label: 'Signers List',
        value: '[]',
        placeholder: 'Enter Signers List',
      },
      {
        name: 'sessionIdComponents',
        label: 'Session Id Components',
        value: '{}',
        placeholder: 'Enter Session Id Components',
      },
      {
        name: 'specUuid',
        label: 'Spec Uuid',
        value: '',
        placeholder: 'Enter Spec Uuid',
      }
    ],
  },
];

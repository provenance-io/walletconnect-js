export const ALL_ACTIONS = [
  // Sign Message Method/Action
  {
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
  // Send Hash Method/Action
  {
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
  // Delegate Hash Method/Action
  {
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
  // Add Marker Method/Action
  {
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
  // Activate Request Method/Action
  {
    method: 'activateRequest',
    buttonTxt: 'Activate Request',
    fields: [
      {
        name: 'denom',
        label: 'Marker Denom',
        value: 'myNewMarker',
        placeholder: 'Enter Marker Denom',
        width: '30%',
      },
      {
        name: 'administrator',
        label: 'Administrator',
        value: 'tp194r5us3l3yg7rpwepn9c7awgcesp5kp84r5lye',
        placeholder: 'Enter Administrator Address',
        width: '70%',
      },
    ],
  },
  // Sign JWT Method/Action
  {
    method: 'signJWT',
    buttonTxt: 'Sign JWT',
  },
];

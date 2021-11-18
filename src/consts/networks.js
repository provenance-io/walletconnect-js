const BASIC_NETWORK = {
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

const PROVENANCE_MAINNET_NETWORK = {
  ...BASIC_NETWORK,
  messagePrefix: '\x18Provenance Signed Message:\n',
  bech32: 'pb',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
};

const PROVENANCE_TESTNET_NETWORK = {
  ...BASIC_NETWORK,
  messagePrefix: '\x18Provenance Testnet Signed Message:\n',
  bech32: 'tp',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
};

// Variable network either prod or testnet 
export const PROVENANCE_NETWORK = (process.env.REACT_APP_NETWORK === 'mainnet') ? PROVENANCE_MAINNET_NETWORK : PROVENANCE_TESTNET_NETWORK;

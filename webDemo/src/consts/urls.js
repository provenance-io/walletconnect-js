// Wallet Urls
export const FIGURE_WALLET_URL = process.env.REACT_APP_FIGURE_WALLET_URL;
export const PROVENANCE_WALLET_URL = process.env.REACT_APP_PROVENANCE_WALLET_URL;
export const FIGURE_TECH_CONSOLE_URL = process.env.REACT_APP_FIGURE_TECH_CONSOLE_URL;
export const BRIDGE_API_URL = process.env.REACT_APP_BRIDGE_API_URL;
export const BRIDGE_WALLET_KYC_URL = `${BRIDGE_API_URL}/pb/name/attribute/passport/pb`;
// WalletConnect Urls
export const WALLETCONNECT_BRIDGE_URL = process.env.REACT_APP_WALLETCONNECT_BRIDGE_URL;
export const PROVENANCE_API_BASE_URL = process.env.REACT_APP_PROVENANCE_API_BASE_URL;
export const PROVENANCE_API_ACCOUNT_ASSETS_URL = `${PROVENANCE_API_BASE_URL}/cosmos/bank/v1beta1/balances`;
export const PROVENANCE_API_TXS_URL = `${PROVENANCE_API_BASE_URL}/account-transactions`;
export const PROVENANCE_API_NONCE_URL = `${PROVENANCE_API_BASE_URL}/account-nonce`;
export const PROVENANCE_API_GAS_PRICES_URL = `${PROVENANCE_API_BASE_URL}/gas-prices`;
export const PROVENANCE_API_ACCOUNT_ATTRIBUTES = `${PROVENANCE_API_BASE_URL}/provenance/attribute/v1/attributes`;

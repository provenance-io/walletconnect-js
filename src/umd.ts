import { WalletConnectService } from './services';
import { WINDOW_MESSAGES } from './consts/windowMessages';
  
// NOTE: When we include WalletConnectService the standalone lib fails
// When we only export the test and WINDOW_MESSAGES it works as expected.
export {
  WINDOW_MESSAGES,
  WalletConnectService,
};

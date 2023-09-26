import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { BrowserWallet, ResumeMethodServiceFunctionResults } from '../../../types';
import { getPageData } from '../../../utils';

// Determine if the browser wallet is still connected, if so, get back those connection details
export const resumeConnection = async (wallet: BrowserWallet) => {
  const method = PROVENANCE_METHODS.RESUME;

  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();

  const request = {
    browserEvent: BROWSER_EVENTS.RESUME_CONNECTION,
    method,
    requestFavicon,
    requestName,
    requestOrigin,
  };

  const response = await wallet.browserEventAction(request, method);

  const { error, est, exp } = response;
  if (error) return { error, resetState: true };

  const result: ResumeMethodServiceFunctionResults = {
    state: {
      connection: { status: 'connected', est, exp },
    },
  };

  return result;
};

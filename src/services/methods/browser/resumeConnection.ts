import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { BrowserWallet, ResumeMethodServiceFunctionResults, ResumeRequestBrowser } from '../../../types';
import { getPageData, rngNum } from '../../../utils';

// Determine if the browser wallet is still connected, if so, get back those connection details
export const resumeConnection = async (wallet: BrowserWallet, description = 'Resume Connection') => {
  const method = PROVENANCE_METHODS.RESUME;

  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();

  const request: ResumeRequestBrowser = {
    browserEvent: BROWSER_EVENTS.RESUME_CONNECTION,
    date: Date.now(),
    description,
    id: `${rngNum()}`,
    method: PROVENANCE_METHODS.DISCONNECT,
    requestFavicon,
    requestName,
    requestOrigin,
  };

  const { error, result } = await wallet.browserEventAction(request, method);
  if (error) return { error, resetState: true };
  if (!result) return { error: { message: 'Missing result', code: 0 }, resetState: true};

  const {est, exp} = result;
  const methodResult: ResumeMethodServiceFunctionResults = {
    state: {
      connection: { status: 'connected', est, exp },
    },
  };

  return methodResult;
};

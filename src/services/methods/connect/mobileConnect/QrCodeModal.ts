import { WalletId } from '../../../../types';

interface QRCodeModalState {
  connectionWalletAppId?: WalletId;
  connectionDuration?: number;
  jwtDuration?: number;
  prohibitGroups?: boolean;
  requiredGroupAddress?: string;
  requiredIndividualAddress?: string;
  onOpenCallback?: (dataUrl: string) => void;
  onCloseCallback?: () => void;
}

export class QRCodeModal {
  state: QRCodeModalState = {};

  constructor(initialState?: Partial<QRCodeModalState>) {
    if (initialState) this.state = initialState;
  }

  close = async () => {
    if (this.state.onCloseCallback) this.state.onCloseCallback();
  };

  open = async (data: string) => {
    const {
      requiredIndividualAddress,
      requiredGroupAddress,
      prohibitGroups,
      jwtDuration,
      connectionDuration,
      onOpenCallback,
    } = this.state;
    // Check for address and prohibit groups values to append to the wc value for the wallet to read when connecting
    const requiredIndividualAddressParam = requiredIndividualAddress
      ? `&individualAddress=${requiredIndividualAddress}`
      : '';
    const requiredGroupAddressParam = requiredGroupAddress
      ? `&groupAddress=${requiredGroupAddress}`
      : '';
    const prohibitGroupsParam = prohibitGroups ? `&prohibitGroups=true` : '';
    const jwtDurationParam = jwtDuration ? `&jwtExpiration=${jwtDuration}` : '';
    const connectionDurationParam = connectionDuration
      ? `&connectionDuration=${connectionDuration}`
      : '';
    const fullData = `${data}${requiredIndividualAddressParam}${requiredGroupAddressParam}${prohibitGroupsParam}${jwtDurationParam}${connectionDurationParam}`;
    // If we need to open a wallet directly, we won't be opening the QRCodeModal and will instead trigger that wallet directly
    // if (connectionWalletAppId) openDirectWallet(connectionWalletAppId, fullData);
    // Run callback now that we're opened
    if (onOpenCallback) onOpenCallback(fullData);
  };
}

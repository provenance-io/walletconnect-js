import WalletConnectClient from '@walletconnect/client';
import QRCode from 'qrcode';
import type { WCSSetState } from '../../../types';

interface Props {
  requiredAddress?: string;
  bridge: string;
  prohibitGroups?: boolean;
  noPopup?: boolean;
  setState: WCSSetState;
}

export const createConnector = ({
  requiredAddress,
  bridge,
  prohibitGroups,
  noPopup,
  setState,
}: Props) => {
  class QRCodeModal {
    open = async (data: string) => {
      // Check for address and prohibit groups values to append to the wc value for the wallet to read when connecting
      const requiredAddressParam = requiredAddress
        ? `&address=${requiredAddress}`
        : '';
      const prohibitGroupsParam = prohibitGroups ? `&prohibitGroups=true` : '';
      const fullData = `${data}${requiredAddressParam}${prohibitGroupsParam}`;
      const qrcode = await QRCode.toDataURL(fullData);
      setState({ QRCode: qrcode, QRCodeUrl: fullData, showQRCodeModal: !noPopup });
    };

    close = () => {
      setState({ showQRCodeModal: false });
    };
  }
  const qrcodeModal = new QRCodeModal();
  // create new connector
  const newConnector = new WalletConnectClient({ bridge, qrcodeModal });
  return newConnector;
};

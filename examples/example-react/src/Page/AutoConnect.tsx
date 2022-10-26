import { useState } from 'react';
import { WALLET_LIST, useWalletConnect } from '@provenanceio/walletconnect-js';
import { Input, ActionCard, Dropdown } from 'Components';
import { ICON_NAMES } from 'consts';

export const AutoConnect: React.FC = () => {
  const [duration, setDuration] = useState('');
  const [wallet, setWallet] = useState('');
  const [url, setUrl] = useState('');
  const { walletConnectState } = useWalletConnect();
  const { bridge } = walletConnectState;

  const walletIdOptions = WALLET_LIST.map(({ id }) => id);

  return (
    <ActionCard
      icon={ICON_NAMES.RELOAD}
      title="Auto Connect"
      description="Automatically initiate a wcjs connection on a new url"
    >
      <Dropdown options={walletIdOptions} onChange={setWallet} value={wallet} />
      <Input
        value={url}
        label="URL to send user to"
        placeholder="Enter URL value"
        onChange={setUrl}
        bottomGap
      />
      <Input
        value={duration}
        label="New connection timeout duration"
        placeholder="(optional) Enter duration in seconds"
        onChange={setDuration}
        bottomGap
      />
      <a
        href={`${url}?wcjs_wallet=${wallet}&wcjs_bridge${bridge}${
          duration ? `&wcjs_duration=${duration}` : ''
        }`}
        target="_blank"
        rel="noreferrer"
      >
        Navigate to new url
      </a>
    </ActionCard>
  );
};

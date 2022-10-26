import { useState } from 'react';
import { WALLET_LIST, useWalletConnect } from '@provenanceio/walletconnect-js';
import { Input, ActionCard, Dropdown, Button } from 'Components';
import { ICON_NAMES } from 'consts';

export const AutoConnect: React.FC = () => {
  const walletIdOptions = WALLET_LIST.map(({ id }) => id).sort();
  const [duration, setDuration] = useState('');
  const [walletId, setWalletId] = useState(walletIdOptions[0]);
  const [url, setUrl] = useState('http://localhost:3000/walletconnect');
  const { walletConnectService: wcs } = useWalletConnect();

  const handleSubmit = async () => {
    const newUrl = wcs.generateAutoConnectUrl({
      url,
      walletId,
      duration: duration ? Number(duration) : undefined,
    });
    // If the url is this localhost demo, first kill the connection before redirection
    if (url.includes('http://localhost:3000/walletconnect')) {
      await wcs.disconnect();
    }
    // Navigate to new page
    window.location.href = newUrl;
  };

  return (
    <ActionCard
      icon={ICON_NAMES.CHECK}
      title="Auto Connect"
      description="Automatically initiate a wcjs connection on a new url"
    >
      <Dropdown
        options={walletIdOptions}
        onChange={setWalletId}
        value={walletId}
        label="Select a wallet ID"
        bottomGap
      />
      <Input
        value={url}
        label="URL to send user to"
        placeholder="Enter URL value"
        onChange={setUrl}
        bottomGap
      />
      <Input
        value={duration}
        label="New connection timeout duration (seconds)"
        placeholder="(optional) Enter duration in seconds"
        onChange={setDuration}
        bottomGap
      />
      <Button onClick={handleSubmit}>Visit New Page</Button>
    </ActionCard>
  );
};

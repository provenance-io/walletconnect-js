import styled from 'styled-components';
import { useState } from 'react';
import { useWalletConnect, ProvenanceMethod } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, Results, Dropdown } from 'Components';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';

export const SendWalletMessage: React.FC = () => {
  const walletMessage = 'wallet_message';
  const [payload, setPayload] = useState('')
  const [description, setDescription] = useState('');
  const [action, setAction] = useState('');
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const [method, setMethod] = useState<ProvenanceMethod>(walletMessage);

  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod } = walletConnectState;
  const sendMessageLoading = pendingMethod === 'sendWalletMessage';

  const isJSON = (data:string) => {
    try {
      if(data) {
        JSON.parse(data);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  const disableSubmit = () => {
    return (!payload || !action);
  }

  const handleSubmit = async () => {

    const result = await wcs.sendWalletMessage({
      action,
      payload: JSON.parse(payload),
      description,
      method,
    });
    setResults({
      action: 'sendWalletMessage',
      status: result.error ? 'failed' : 'success',
      message: result.error
        ? result.error
        : 'WalletConnectJS | Send Wallet Message Complete',
      data: result,
    });
  };

  const jsonMessageValidator = () => {
    if (!!payload && method !== walletMessage) {
      return `Message Method must be wallet_message when using Plain JSON message.`;
    }
    if (!isJSON(payload)) {
      return 'Not valid JSON.';
    }
    return '';
  }

  return (
    <ActionCard
      icon={ICON_NAMES.GEAR}
      title="Send Wallet Message"
      description="Pass along a message to the wallet"
      status={results?.status}
    >
      <Dropdown
        value={method}
        label="Message Method"
        onChange={setMethod}
        bottomGap
        options={['wallet_message']}
      />
      <Input
          width="100%"
          value={payload}
          label="Plain JSON Message"
          placeholder="Plain Message"
          onChange={setPayload}
          bottomGap
          disabled={sendMessageLoading}
          error={jsonMessageValidator()}
      />
      <Input
          width="100%"
          value={action}
          label="Action"
          placeholder="Action"
          onChange={setAction}
          bottomGap
          disabled={sendMessageLoading}
      />

      <Input
          value={description}
          label="Message description (Optional)"
          placeholder="Enter message description"
          onChange={setDescription}
          bottomGap
          disabled={sendMessageLoading}
      />

      <Button
        loading={sendMessageLoading}
        onClick={handleSubmit}
        disabled={disableSubmit()}
      >
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};

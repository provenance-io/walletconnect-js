import { useState } from 'react';
import { useWalletConnect, ProvenanceMethod } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, Results } from 'Components';
import { ICON_NAMES } from 'consts';

export const SendWalletAction: React.FC = () => {
  const [payload, setPayload] = useState('')
  const [description, setDescription] = useState('');
  const [action, setAction] = useState('');
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const method: ProvenanceMethod = 'wallet_action';

  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod } = walletConnectState;
  const sendMessageLoading = pendingMethod === 'sendWalletAction';

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

  const disableSubmit = () => (!payload || !action);

  const handleSubmit = async () => {

    const result = await wcs.sendWalletAction({
      action,
      payload: JSON.parse(payload),
      description,
      method,
    });
    setResults({
      action: 'sendWalletAction',
      status: result.error ? 'failed' : 'success',
      message: result.error
        ? result.error
        : 'WalletConnectJS | Send Wallet Action Complete',
      data: result,
    });
  };

  const jsonMessageValidator = () => {
    if (!isJSON(payload)) {
      return 'Not valid JSON.';
    }
    return '';
  }

  return (
    <ActionCard
      icon={ICON_NAMES.GEAR}
      title="Send Wallet Action"
      description="Pass along a message to the wallet"
      status={results?.status}
    >
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

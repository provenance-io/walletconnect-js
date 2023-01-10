import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES, useWalletConnect } from '@provenanceio/walletconnect-js';
import { buildMessage, createAnyMessageBase64 } from '@provenanceio/wallet-utils';
import { Button, Input, ActionCard, ActionGas, Results } from 'Components';
import { ICON_NAMES } from 'consts';

export const SendCoin: React.FC = () => {
  const [amount, setAmount] = useState('1000000000');
  const [toAddress, setToAddress] = useState(
    'tp1vxlcxp2vjnyjuw6mqn9d8cq62ceu6lllpushy6'
  );
  const [denom, setDenom] = useState('nhash');
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const [initialLoad, setInitialLoad] = useState(true);
  const [feeGranter, setFeeGranter] = useState('');
  const [gasData, setGasData] = useState({ gasPrice: '', gasPriceDenom: '' });
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { loading, address, representedGroupPolicy } = walletConnectState;
  const groupAddress = representedGroupPolicy?.address;
  const sendMessageLoading = loading === 'sendMessage';

  const handleSubmit = () => {
    const sendMessage = {
      fromAddress: groupAddress ? groupAddress : address,
      toAddress,
      amountList: [{ denom, amount }],
    };
    const finalGasData = { ...gasData, gasPrice: Number(gasData.gasPrice) };

    const msgSend = buildMessage('MsgSend', sendMessage);
    if (msgSend) {
      const msg = createAnyMessageBase64('MsgSend', msgSend);

      const message = {
        method: 'provenance_sendTransaction',
        gasPrice: finalGasData,
        description: `Send ${amount}${denom} to ${toAddress}`,
        message: msg,
        feeGranter,
      };

      // Convert input string value to number for price
      wcs.sendMessage(message);
    } else {
      // No msgSend, show an error
      setResults({
        action: 'sendMessage',
        status: 'failure',
        message: 'Unable to send message - buildMessage failed',
        data: {},
      });
    }
  };

  // Create all event listeners for this Action Card method
  useEffect(() => {
    const completeEvent = (result: any) => {
      setResults({
        action: 'sendMessage',
        status: 'success',
        message: 'WalletConnectJS | Send Message Complete',
        data: result,
      });
    };
    const failEvent = (result: any) => {
      const { error } = result;
      setResults({
        action: 'sendMessage',
        status: 'failed',
        message: error.message,
        data: result,
      });
    };
    // First load, if windowMessages passed in, create events
    if (initialLoad) {
      setInitialLoad(false);
      wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, completeEvent);
      wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, failEvent);
    }
  }, [initialLoad, wcs]);

  return (
    <ActionCard
      icon={ICON_NAMES.HASH}
      title="Send Coin"
      description="Send coin to another address (uses sendMessage method)"
      status={results?.status}
    >
      <Input
        width="100%"
        value={toAddress}
        label="To Address"
        placeholder="Enter to address"
        onChange={setToAddress}
        bottomGap
        disabled={sendMessageLoading}
      />
      <Input
        width="100%"
        value={amount}
        label="Amount"
        placeholder="Enter amount"
        onChange={setAmount}
        bottomGap
        disabled={sendMessageLoading}
      />
      <Input
        value={denom}
        label="Denom"
        placeholder="Enter denom"
        onChange={setDenom}
        bottomGap
        disabled={sendMessageLoading}
      />
      <Input
        value={feeGranter}
        label="Fee Granter (Optional)"
        placeholder="Enter fee granter"
        onChange={setFeeGranter}
        bottomGap
        disabled={sendMessageLoading}
      />
      <ActionGas setGasData={setGasData} gasData={gasData} />
      <Button
        loading={sendMessageLoading}
        onClick={handleSubmit}
        disabled={!toAddress || !amount}
      >
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};

import { useState } from 'react';
import { useWalletConnect, ProvenanceMethod } from '@provenanceio/walletconnect-js';
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
  const [feeGranter, setFeeGranter] = useState('');
  const [gasData, setGasData] = useState({ gasPrice: '', gasPriceDenom: '' });
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod, address, representedGroupPolicy } = walletConnectState;
  const groupAddress = representedGroupPolicy?.address;
  const sendMessageLoading = pendingMethod === 'sendMessage';

  const handleSubmit = async () => {
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
        method: 'provenance_sendTransaction' as ProvenanceMethod,
        gasPrice: finalGasData,
        description: `Send ${amount}${denom} to ${toAddress}`,
        message: msg,
        feeGranter,
      };

      // Convert input string value to number for price
      const result = await wcs.sendMessage(message);
      console.log(
        'example-react | SendCoin | handleSubmit | sendMessage result: ',
        result
      );
      setResults({
        action: 'signMessage',
        status: result.error ? 'failed' : 'success',
        message: result.error ? result.error : 'WalletConnectJS | SendCoin Complete',
        data: result,
      });
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

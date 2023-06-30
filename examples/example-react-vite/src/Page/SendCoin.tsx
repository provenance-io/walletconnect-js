import { useState } from 'react';
import styled from 'styled-components';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import type { ProvenanceMethod, SendMessageMethodEventData, BroadcastEventData } from '@provenanceio/walletconnect-js';
import { buildMessage, createAnyMessageBase64 } from '@provenanceio/wallet-utils';
import { Button, Input, ActionCard, ActionGas, Results } from 'Components';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';

const TotalMessages = styled.div`
  width: 100%;
  margin-bottom: 10px;
  font-style: italic;
`;

const AdvancedOptionsToggle = styled.p<{ showAdvanced: boolean }>`
  margin-bottom: 30px;
  user-select: none;
  cursor: pointer;
  color: ${({ showAdvanced }) =>
    showAdvanced ? COLORS.PRIMARY_300 : COLORS.PRIMARY_500};
  font-weight: bold;
  font-style: italic;
  font-size: 1.2rem;
  width: 100%;
`;
const AdvancedOptions = styled.div`
  border: 1px solid ${COLORS.NEUTRAL_250};
  background: ${COLORS.NEUTRAL_100};
  padding: 20px 30px;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 100%;
`;

export const SendCoin: React.FC = () => {
  const [amount, setAmount] = useState('10');
  const [toAddress, setToAddress] = useState(
    'tp1vxlcxp2vjnyjuw6mqn9d8cq62ceu6lllpushy6'
  );
  const [denom, setDenom] = useState('nhash');
  const [results, setResults] = useState<BroadcastEventData[keyof BroadcastEventData] | undefined>();
  const [feeGranter, setFeeGranter] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [blockTimeoutHeight, setBlockTimeoutHeight] = useState('');
  const [customId, setCustomId] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [showRetry, setShowRetry] = useState(false);
  const [b64MessageArray, setB64MessageArray] = useState<string[]>([]);
  const [gasData, setGasData] = useState({ gasPrice: '', gasPriceDenom: '' });
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod, address, representedGroupPolicy } = walletConnectState;
  const groupAddress = representedGroupPolicy?.address;
  const sendMessageLoading = pendingMethod === 'sendMessage';

  const buildB64Message = () => {
    const sendMessage = {
      fromAddress: groupAddress ? groupAddress : address,
      toAddress,
      amountList: [{ denom, amount }],
    };
    const msgSend = buildMessage('MsgSend', sendMessage);
    return msgSend ? createAnyMessageBase64('MsgSend', msgSend) : '';
  };

  const buildSendMessage = () => {
    const msg = b64MessageArray.length ? b64MessageArray : buildB64Message();
    if (msg) {
      const finalGasData = { ...gasData, gasPrice: Number(gasData.gasPrice) };
      const message = {
        method: 'provenance_sendTransaction' as ProvenanceMethod,
        gasPrice: finalGasData,
        description: `Send ${amount}${denom} to ${toAddress}`,
        message: msg,
        feeGranter,
        ...(redirectUrl && { redirectUrl }),
        ...(customId && { customId }),
        ...(blockTimeoutHeight && { timeoutHeight: Number(blockTimeoutHeight) }),
      };
      return message;
    }
    return '';
  };

  const handleAddToMsgArray = () => {
    const newB64MessageArray = [...b64MessageArray];
    // Just take the current state values and use them
    const newB64Msg = buildB64Message();
    newB64MessageArray.push(newB64Msg);
    setB64MessageArray(newB64MessageArray);
  };

  const handleSubmit = async () => {
    setShowRetry(true);
    const message = buildSendMessage();
    if (message) {
      // Convert input string value to number for price
      const result = await wcs.sendMessage(message);
      setResults(result);
    } else {
      // No msgSend, show an error
      setResults({
        error: 'Unable to send message - buildMessage failed',
      });
    }
  };

  const status = results ? results.error ? 'failure' : 'success' : undefined;

  const closeRequest = async (reopen?: boolean) => {
    setShowRetry(false);
    const rejected = await wcs.removePendingMethod(customId);
    if (!rejected.error && reopen) {
      handleSubmit();
    }
  };

  return (
    <ActionCard
      icon={ICON_NAMES.HASH}
      title="Send Coin"
      description="Send coin to another address (uses sendMessage method)"
      status={status}
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
      <AdvancedOptionsToggle
        showAdvanced={showAdvanced}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
      </AdvancedOptionsToggle>
      {showAdvanced && (
        <AdvancedOptions>
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
          <Input
            value={blockTimeoutHeight}
            label="Block Timeout Height (Optional)"
            placeholder="Enter Block Timeout Height"
            onChange={setBlockTimeoutHeight}
            bottomGap
            disabled={sendMessageLoading}
          />
          <Input
            value={redirectUrl}
            label="Redirect URL (Optional)"
            placeholder="Enter Redirect URL"
            onChange={setRedirectUrl}
            bottomGap
            disabled={sendMessageLoading}
          />
          <Input
            value={customId}
            label="Custom ID (Optional)"
            placeholder="Enter Custom ID"
            onChange={setCustomId}
            bottomGap
            disabled={sendMessageLoading}
          />
          <ActionGas setGasData={setGasData} gasData={gasData} />
          {!!b64MessageArray.length && (
            <TotalMessages>({b64MessageArray.length} total messages)</TotalMessages>
          )}
        </AdvancedOptions>
      )}
      <Button
        loading={sendMessageLoading}
        onClick={handleAddToMsgArray}
        disabled={!toAddress || !amount}
      >
        Add to Tx Array
      </Button>
      {!!b64MessageArray.length && (
        <Button
          loading={sendMessageLoading}
          onClick={() => {
            setB64MessageArray([]);
          }}
        >
          Clear Message Array
        </Button>
      )}
      <Button
        loading={sendMessageLoading}
        onClick={handleSubmit}
        disabled={!toAddress || !amount}
      >
        Submit
      </Button>
      {showRetry && customId && <>
      <Button onClick={() => closeRequest()}>Cancel SendCoin</Button>
      <Button onClick={() => closeRequest(true)}>Retry SendCoin</Button>
      </>
      }
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};

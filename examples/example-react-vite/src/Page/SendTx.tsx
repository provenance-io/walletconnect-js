import { buildMessage, createAnyMessageBase64 } from '@provenanceio/wallet-utils';
import {
  PROVENANCE_METHODS,
  useWalletConnect,
} from '@provenanceio/walletconnect-js';
import { ActionCard, ActionGas, Button, Input, Results, Sprite } from 'Components';
import { ICON_NAMES } from 'consts';
import { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme';

const HiddenSprite = styled(Sprite)`
  color: ${COLORS.NEUTRAL_300};
  cursor: pointer;
  position: absolute;
  top: 6px;
  right: 4px;
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
const TotalMessages = styled.div`
  width: 100%;
  margin-bottom: 10px;
  font-style: italic;
`;
const TxTypeButtons = styled.div`
  display: flex;
  margin-bottom: 20px;
  button {
    padding: 6px 10px 2px 10px;
    border: 1px solid ${COLORS.PRIMARY_200};
    background: ${COLORS.PRIMARY_200};
    cursor: pointer;
    color: ${COLORS.WHITE};
    border-radius: 4px;
    font-size: 1rem;
    margin: 2px;
    vertical-align: middle;
    &[data-active='true'] {
      border: 1px solid ${COLORS.PRIMARY_500};
      background: ${COLORS.PRIMARY_450};
    }
  }
`;

export const SendTx: React.FC = () => {
  const DEFAULT_VALUES = {
    SEND_ADDRESS: 'tp1vxlcxp2vjnyjuw6mqn9d8cq62ceu6lllpushy6',
    DENOM: 'nhash',
    AMOUNT: '10',
  };
  // State for component
  const [results, setResults] = useState<any>(); // TODO: This needs a valid type
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isPremadeTx, setIsPremadeTx] = useState(true);
  // State for MsgSend
  const [amount, setAmount] = useState(DEFAULT_VALUES.AMOUNT);
  const [toAddress, setToAddress] = useState(DEFAULT_VALUES.SEND_ADDRESS);
  const [denom, setDenom] = useState(DEFAULT_VALUES.DENOM);
  const [feeGranter, setFeeGranter] = useState('');
  const [blockTimeoutHeight, setBlockTimeoutHeight] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  // State for full b64 tx
  const [b64Tx, setB64Tx] = useState('');
  // State for both
  const [description, setDescription] = useState('');
  const [customId, setCustomId] = useState('');
  const [txB64Array, setTxB64Array] = useState<string[]>([]);
  const [gasData, setGasData] = useState({ gasPrice: '', gasPriceDenom: '' });

  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod } = walletConnectState.connection;
  const { address, representedGroupPolicy } = walletConnectState.wallet;
  const groupAddress = representedGroupPolicy?.address;
  const sendTxLoading = pendingMethod === 'sendTx';

  const buildB64Message = () => {
    const sendMessage = {
      fromAddress: groupAddress ? groupAddress : address!, // Address will always be available when connected
      toAddress,
      amountList: [{ denom, amount }],
    };
    const msgSend = buildMessage('MsgSend', sendMessage);

    return msgSend ? createAnyMessageBase64('MsgSend', msgSend) : '';
  };

  const buildSendMessage = () => {
    const msg = isPremadeTx ? [b64Tx] : buildB64Message();
    const finalGasData = { ...gasData, gasPrice: Number(gasData.gasPrice) };
    const tx = {
      method: PROVENANCE_METHODS.SEND,
      gasPrice: finalGasData,
      description: description || `Send ${amount}${denom} to ${toAddress}`,
      tx: msg,
      feeGranter,
      ...(redirectUrl && { redirectUrl }),
      ...(customId && { customId }),
      ...(blockTimeoutHeight && { timeoutHeight: Number(blockTimeoutHeight) }),
    };
    return tx;
  };

  const handleAddToMsgArray = () => {
    const newTxB64Array = [...txB64Array];
    // Just take the current state values and use them
    const newB64Msg = buildB64Message();
    newTxB64Array.push(newB64Msg);
    setTxB64Array(newTxB64Array);
  };

  const handleSubmit = async () => {
    // Do we need to build the message? (Not a prebuilt B64)
    const fullTxMsg = buildSendMessage();
    const result = await wcs.sendTx(fullTxMsg);
    setResults(result);
  };

  const toggleTxType = (value: boolean) => {
    setIsPremadeTx(value);
    setTxB64Array([]);
  };

  const clickUseSampleButton = () => {
    setB64Tx(
      'ChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmwKKXRwMWtuc3hmbm4wbHE0OG1tbmtmbmtndGtrOHFueHhkdTB5MnRrbGtoEil0cDFrbnN4Zm5uMGxxNDhtbW5rZm5rZ3Rrazhxbnh4ZHUweTJ0a2xraBoUCgVuaGFzaBILMTAwMDAwMDAwMDA='
    );
  };

  const status = results ? (results.error ? 'failure' : 'success') : undefined;

  const renderAdvancedSettings = () => (
    <AdvancedOptions>
      <Input
        value={description}
        label="Description (Optional)"
        placeholder="Enter message description"
        onChange={setDescription}
        bottomGap
        disabled={sendTxLoading}
      />
      <Input
        value={customId}
        label="Custom ID (Optional)"
        placeholder="Enter Custom ID"
        onChange={setCustomId}
        bottomGap
        disabled={sendTxLoading}
      />
      <ActionGas setGasData={setGasData} gasData={gasData} />
      {!isPremadeTx && (
        <>
          <Input
            value={denom}
            label="Denom"
            placeholder="Enter denom"
            onChange={setDenom}
            bottomGap
            disabled={sendTxLoading}
          />
          <Input
            value={feeGranter}
            label="Fee Granter (Optional)"
            placeholder="Enter fee granter"
            onChange={setFeeGranter}
            bottomGap
            disabled={sendTxLoading}
          />
          <Input
            value={blockTimeoutHeight}
            label="Block Timeout Height (Optional)"
            placeholder="Enter Block Timeout Height"
            onChange={setBlockTimeoutHeight}
            bottomGap
            disabled={sendTxLoading}
          />
          <Input
            value={redirectUrl}
            label="Redirect URL (Optional)"
            placeholder="Enter Redirect URL"
            onChange={setRedirectUrl}
            bottomGap
            disabled={sendTxLoading}
          />
        </>
      )}
    </AdvancedOptions>
  );

  return (
    <ActionCard
      icon={ICON_NAMES.GEAR}
      title="Send Transaction"
      description="Pass along an encoded base64 transaction to the wallet"
      status={status}
    >
      <TxTypeButtons>
        <button onClick={() => toggleTxType(true)} data-active={isPremadeTx}>
          Use B64 Tx
        </button>
        <button onClick={() => toggleTxType(false)} data-active={!isPremadeTx}>
          Build MsgSend Tx
        </button>
      </TxTypeButtons>
      {isPremadeTx ? (
        <>
          <HiddenSprite
            onClick={clickUseSampleButton}
            icon={ICON_NAMES.GEAR}
            size="1.8rem"
          />
          <Input
            width="100%"
            value={b64Tx}
            label="Base64 Transaction"
            placeholder="Enter Base64 Encoded Transaction"
            onChange={(value) => setB64Tx(value)}
            bottomGap
            disabled={sendTxLoading}
          />
        </>
      ) : (
        <>
          <Input
            width="100%"
            value={toAddress}
            label="To Address"
            placeholder="Enter to address"
            onChange={setToAddress}
            bottomGap
            disabled={sendTxLoading}
          />
          <Input
            width="100%"
            value={amount}
            label="Amount"
            placeholder="Enter amount"
            onChange={setAmount}
            bottomGap
            disabled={sendTxLoading}
          />
        </>
      )}
      <AdvancedOptionsToggle
        showAdvanced={showAdvanced}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
      </AdvancedOptionsToggle>
      {!!txB64Array.length && (
        <TotalMessages>
          ({txB64Array.length} message{txB64Array.length > 1 && 's'})
        </TotalMessages>
      )}
      {showAdvanced && renderAdvancedSettings()}
      {!isPremadeTx && (
        <>
          <Button
            loading={sendTxLoading}
            onClick={handleAddToMsgArray}
            disabled={!toAddress || !amount}
          >
            Add to Tx Array
          </Button>
          {txB64Array.length && (
            <Button
              loading={sendTxLoading}
              onClick={() => {
                setTxB64Array([]);
              }}
            >
              Clear Message Array
            </Button>
          )}
        </>
      )}
      <Button
        loading={sendTxLoading}
        onClick={handleSubmit}
        disabled={isPremadeTx && !b64Tx}
      >
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};

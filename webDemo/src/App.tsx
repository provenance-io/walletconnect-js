import { useState, useEffect } from 'react';
import { useWalletConnect, QRCodeModal } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import { Action, Connect, Dropdown, Header, Results } from 'Components';
import { ALL_ACTIONS, BRIDGE_URLS } from 'consts';

const HomeContainer = styled.div`
  position: relative;
  padding: 100px;
  @media (max-width: 740px) {
    padding: 100px 12px 20px 12px;
  }
`;
const ContentBack = styled.div`
  color: white;
  padding: 40px 50px;
  width: 840px;
  height: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  margin: 60px auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 1px 10px 2px rgba(0, 0, 0, 0.4);
`;
const ContentCover = styled.a`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  z-index: 2;
  background: transparent;
  transition: 500ms all;
  user-select: none;
  pointer-events: none;
  background: radial-gradient(
      80.87% 32.41% at 49.85% 0%,
      rgba(90, 90, 200, 0.5) 6.25%,
      rgba(55, 78, 125, 0) 96.35%
    ),
    radial-gradient(
      117.93% 56.41% at 113.12% 107.17%,
      #616e9d 6.25%,
      rgba(65, 67, 122, 0.71) 35.94%,
      rgba(56, 94, 121, 0) 100%
    );
`;
const Title = styled.p`
  font-weight: 700;
  font-size: 2.25rem;
  line-height: 3.2rem;
  margin: 0 0 14px 0;
`;
const Error = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  background: #ffdddd;
  padding: 10px;
  text-align: center;
  border-radius: 6px;
  margin-bottom: 26px;
  font-style: italic;
  color: #dd5555;
`;

export const App = () => {
  const [activeMethod, setActiveMethod] = useState(undefined);
  const [bridgeUrl, setBridgeUrl] = useState(BRIDGE_URLS[0]);
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>(null);

  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { publicKey, connected } = walletConnectState;

  useEffect(() => {
    // When disconnected, reset actions and results
    if (!connected) {
      setActiveMethod(undefined);
      setResults(null);
    }
  }, [connected]);

  const dropdownOptions = ALL_ACTIONS.map(({ method }) => method).sort();

  const renderActions = () =>
    ALL_ACTIONS.map(({ method, fields, windowMessage, gas }) => {
      if (activeMethod === method) {
        return (
          <Action
            key={method}
            method={method}
            setResults={setResults}
            fields={fields}
            windowMessage={windowMessage}
            gas={gas}
          />
        );
      }
      return null;
    });

  const changeBridgeUrl = (value: string) => {
    setBridgeUrl(value);
    wcs.setBridge(value);
  };

  return (
    <HomeContainer>
      <Header bridgeUrl={bridgeUrl} />
      <ContentBack>
        <ContentCover />
        {connected ? (
          <>
            {!publicKey && (
              <Error>
                &#9888; No public key found. There&apos;s likely an issue with your
                connected wallet.&#9888;
              </Error>
            )}
            <Title>Select an Action</Title>
            <Dropdown
              options={dropdownOptions}
              onChange={setActiveMethod}
              value={activeMethod!}
            />
            {activeMethod && (
              <>
                <Title>Action Details</Title>
                {renderActions()}
              </>
            )}
            {results ? (
              <>
                <Title>Results</Title>
                <Results results={results} setResults={setResults} />
              </>
            ) : null}
          </>
        ) : (
          <>
            <Title>Select Bridge</Title>
            <Dropdown
              placeholder="Select Bridge"
              options={BRIDGE_URLS}
              onChange={changeBridgeUrl}
              value={BRIDGE_URLS[0]}
            />
            <Title>Connect Wallet</Title>
            <Connect walletConnectService={wcs} setResults={setResults} />
          </>
        )}
      </ContentBack>
      <QRCodeModal walletConnectService={wcs} devWallets={['figure_web']} />
    </HomeContainer>
  );
};

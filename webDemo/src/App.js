import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import { useWalletConnect, QRCodeModal } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import {
  Action,
  Button,
  Connect,
  Dropdown,
  Header,
  Subheader,
  MultiAction,
} from 'Components';
import { ALL_ACTIONS, BRIDGE_URLS } from 'consts';
import { REACT_APP_WCJS_VERSION } from './version'; // eslint-disable-line

const HomeContainer = styled.div`
  position: relative;
  padding: 100px;
  @media (max-width: 740px) {
    padding: 100px 12px 20px 12px;
  }
`;
const Content = styled.div`
  max-width: 100%;
  width: 840px;
  padding: 32px;
  background: #ffffff;
  margin: auto;
  margin-top: 50px;
  @media (max-width: 1150px) {
    margin-top: 92px;
    padding: 12px;
  }
`;
const Title = styled.p`
  font-weight: 700;
  font-family: 'Poppins',sans-serif;
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
const Results = styled.div`
  border: 1px solid #dddddd;
  border-radius: 4px;
  padding: 10px;
  position: relative;
  overflow: auto;
`;
const ResultTitle = styled.span`
  font-weight: bold;
  min-width: 75px;
  margin-right: 20px;
  text-transform: capitalize;
`;
const ResultRow = styled.div`
  display: flex;
  font-size: 1.3rem;
  margin-bottom: 10px;
`;
const ResultValue = styled.p``;
const FloatingButton = styled.p`
  position: absolute;
  top: 20px;
  right: 20px;
  @media (max-width: 1150px) {
    top: -20px;
    right: 0;
    button {
      min-width: 10px;
      padding: 2px 10px;
      font-size: 0.9rem;
      height: auto;
    }
  }
`;

export const App = () => {
  const [activeMethod, setActiveMethod] = useState(undefined);
  const [bridgeUrl, setBridgeUrl] = useState(BRIDGE_URLS[0]);
  const [results, setResults] = useState(null);

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

  const renderActions = () => ALL_ACTIONS.map(({ method, fields, windowMessage, json, gas }) => {
    if (activeMethod === method) {
      if (method === 'multiAction') return <MultiAction key="multiAction" setResults={setResults} />
      return (
        <Action
          key={method}
          method={method}
          setResults={setResults}
          fields={fields}
          windowMessage={windowMessage}
          json={json}
          gas={gas}
        />
      )
    }
    return null;
  });

const changeBridgeUrl = (value) => {
  setBridgeUrl(value);
  wcs.setBridge(value);
};

const renderResults = () => {
  const keys = Object.keys(results);
  return keys.map(key => (
    key === 'data' ?
    <React.Fragment key={key}>
      <ResultRow>
        <ResultTitle>Raw Data:</ResultTitle>
      </ResultRow>
      <ReactJson src={results.data} collapsed />
    </React.Fragment>
    :
    <ResultRow key={key}>
      <ResultTitle>{key}:</ResultTitle>
      <ResultValue>{results[key]}</ResultValue>
    </ResultRow>
  ))
};

return (
  <HomeContainer>
      <Header bridgeUrl={bridgeUrl} />
      <Subheader />
      <Content>
        {connected ? (
          <>
            {!publicKey && <Error>&#9888;  No public key found.  There&apos;s likely an issue with your connected wallet.&#9888;</Error>}
            <Title>Select an Action</Title>
            <Dropdown name="actions" options={dropdownOptions} onChange={setActiveMethod} value={activeMethod} />
            {activeMethod && (
              <>
                <Title>Action Details</Title>
                {renderActions()}
              </>
            )}
            {results && (
              <>
                <Title>Last Action Result</Title>
                <Results>
                  {renderResults()}
                  <FloatingButton>
                    <Button onClick={() => setResults('')} type="button">Clear Results</Button>  
                  </FloatingButton>
                </Results>
              </>
            )}
          </>
        ): (
          <>
            <Title>Select Bridge</Title>
            <Dropdown name="bridgeUrl" placeholder="Select Bridge" options={BRIDGE_URLS} onChange={changeBridgeUrl} value={BRIDGE_URLS[0]} />
            <Title>Connect Wallet</Title>
            <Connect walletConnectService={wcs} setResults={setResults} />
          </>
        )}
      </Content>
      <QRCodeModal
        walletConnectService={wcs}
        walletConnectState={walletConnectState}
        devWallets={['figure_web', 'provenance_extension']}
      />
    </HomeContainer>
  );
}

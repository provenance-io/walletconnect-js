import styled from 'styled-components';
import { Button, Sprite } from 'Components';
import ReactJson from '@microlink/react-json-view';
import { COLORS, FONTS } from 'theme';
import { useState } from 'react';
import { ICON_NAMES } from 'consts';
import type { BroadcastEventData } from '@provenanceio/walletconnect-js';
import { WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';

const ResultsWrapper = styled.div`
  margin-top: 40px;
  width: 100%;
`;
const ResultsTitle = styled.div`
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 1.3rem;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  p {
    margin-right: 4px;
    margin-top: 3px;
  }
`;

const ResultsContainer = styled.div`
  background: ${COLORS.NEUTRAL_150};
  color: ${COLORS.NEUTRAL_550};
  border-radius: 4px;
  padding: 30px;
  position: relative;
  word-wrap: break-word;
  overflow: auto;
  overflow-y: scroll;
  font-family: ${FONTS.MONOSPACE_FONT};
  font-size: 1.3rem;
  max-height: 300px;
  .react-json-view {
    word-break: break-all;
  }
`;
const FloatingButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 16px;
  font-size: 1.2rem;
  height: auto;
  width: auto;
  min-width: auto;
`;

interface Props {
  results?: BroadcastEventData[keyof BroadcastEventData];
  setResults: (results?: BroadcastEventData[keyof BroadcastEventData]) => void;
}

export const Results: React.FC<Props> = ({ results, setResults }) => {
  const [resultsVisible, setResultsVisible] = useState(false);

  return results && Object.keys(results).length ? (
    <ResultsWrapper>
      <ResultsTitle
        onClick={() => {
          setResultsVisible(!resultsVisible);
        }}
      >
        <p>Results</p>
        <Sprite
          icon={ICON_NAMES.CARET}
          size="1.6rem"
          color={COLORS.NEUTRAL_350}
          spin={resultsVisible ? '0' : '180'}
        />
      </ResultsTitle>
      {resultsVisible && (
        <ResultsContainer>
          <ReactJson src={results} />
          <FloatingButton onClick={() => setResults()} type="button">
            Clear Results
          </FloatingButton>
        </ResultsContainer>
      )}
    </ResultsWrapper>
  ) : null;
};

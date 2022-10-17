import styled from 'styled-components';
import { Button, Sprite } from 'Components';
import JsonFormatter from 'react-json-formatter';
import { COLORS, FONTS } from 'theme';
import { useState } from 'react';
import { ICON_NAMES } from 'consts';

const ResultsWrapper = styled.div`
  margin-top: 40px;
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
`;
const ResultKey = styled.div`
  min-width: 75px;
  margin-right: 20px;
  text-transform: capitalize;
  border-bottom: 1px solid ${COLORS.NEUTRAL_300};
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
`;

interface Result {
  [key: string]: any;
}

interface Props {
  results: Result | null;
  setResults: (results: Result | null) => void;
}

export const Results: React.FC<Props> = ({ results, setResults }) => {
  const [resultsVisible, setResultsVisible] = useState(false);

  const jsonStyle = {
    propertyStyle: { color: COLORS.PRIMARY_600 },
    stringStyle: { color: COLORS.NEUTRAL_350 },
    numberStyle: { color: COLORS.SECONDARY_400 },
  };

  const renderResults = () => {
    const keys = Object.keys(results!);
    return keys.map((key) =>
      key === 'data' ? (
        <span key={key}>
          <ResultRow>
            <ResultKey>Raw Data:</ResultKey>
          </ResultRow>
          <JsonFormatter
            json={JSON.stringify(results!.data)}
            tabWith={4}
            jsonStyle={jsonStyle}
          />
        </span>
      ) : (
        <ResultRow key={key}>
          <ResultKey>{key}:</ResultKey>
          <ResultValue>{results![key]}</ResultValue>
        </ResultRow>
      )
    );
  };

  return results ? (
    <ResultsWrapper>
      <ResultsTitle
        onClick={() => {
          setResultsVisible(!resultsVisible);
        }}
      >
        <p>Results</p>
        <Sprite
          icon={ICON_NAMES.CARET}
          size="1.2rem"
          color={COLORS.NEUTRAL_400}
          spin={resultsVisible ? '180' : '0'}
        />
      </ResultsTitle>
      {resultsVisible && (
        <ResultsContainer>
          {renderResults()}
          <FloatingButton>
            <Button onClick={() => setResults(null)} type="button">
              Clear Results
            </Button>
          </FloatingButton>
        </ResultsContainer>
      )}
    </ResultsWrapper>
  ) : null;
};

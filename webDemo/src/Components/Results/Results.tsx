import styled from "styled-components";
import { Button } from "Components";
import JsonFormatter from "react-json-formatter";

const ResultsContainer = styled.div`
  border: 1px solid rgba(60, 60, 100, 0.9);
  background: rgba(10, 10, 30, 0.9);
  color: #dddddd;
  border-radius: 4px;
  padding: 20px;
  position: relative;
  word-wrap: break-word;
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

interface Result {
  [key: string]: any;
}

interface Props {
  results: Result | null;
  setResults: (results: Result | null) => void;
}

export const Results: React.FC<Props> = ({ results, setResults }) => {
  const renderResults = () => {
    const keys = Object.keys(results!);
    return keys.map((key) =>
      key === "data" ? (
        <span key={key}>
          <ResultRow>
            <ResultTitle>Raw Data:</ResultTitle>
          </ResultRow>
          <JsonFormatter json={JSON.stringify(results!.data)} tabWith={4} />
        </span>
      ) : (
        <ResultRow key={key}>
          <ResultTitle>{key}:</ResultTitle>
          <ResultValue>{results![key]}</ResultValue>
        </ResultRow>
      )
    );
  };

  return results ? (
    <ResultsContainer>
      {renderResults()}
      <FloatingButton>
        <Button onClick={() => setResults(null)} type="button">
          Clear Results
        </Button>
      </FloatingButton>
    </ResultsContainer>
  ) : null;
};

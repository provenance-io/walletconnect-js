import { Action, Card, Results } from 'Components';
import { ALL_ACTIONS } from 'consts';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { COLORS } from 'theme';

export const Actions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchParamName = searchParams.get('name') || '';
  const action = ALL_ACTIONS.find(({ method }) => method === searchParamName);
  const { name = 'Unknown', icon, description } = action || {};
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>(null);

  return (
    <Card
      title={`${name} ${results?.status ? `(${results.status})` : ''}`}
      logoIcon={icon}
      logoBg={`${
        results?.status
          ? results.status === 'success'
            ? COLORS.NOTICE_400
            : COLORS.NEGATIVE_400
          : COLORS.SVG_DEFAULT
      }`}
      bannerName={`${
        results?.status
          ? results.status === 'success'
            ? 'figureBuildings'
            : 'figureGrey'
          : 'figureChain'
      }`}
    >
      {description}
      {action && <Action {...action} setResults={setResults} />}
      <Results results={results} setResults={setResults} />
    </Card>
  );
};

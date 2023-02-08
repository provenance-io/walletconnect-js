import styled from 'styled-components';
import { COLORS } from 'theme';
import { Card } from '../Card';

const ActionContainer = styled.div`
  display: flex;
  max-width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 30px;
  flex-wrap: wrap;
  @media (max-width: 1150px) {
    justify-content: flex-start;
    input {
      margin-bottom: 10px;
    }
  }
`;

interface Props {
  title: string;
  icon: string;
  children: React.ReactNode;
  description?: string;
  status?: 'success' | 'failure';
}

export const ActionCard: React.FC<Props> = ({
  title,
  icon,
  children,
  description = 'n/a',
  status,
}) => {
  return (
    <Card
      title={`${title} ${status ? `(${status})` : ''}`}
      logoIcon={icon}
      logoBg={`${
        status
          ? status === 'success'
            ? COLORS.NOTICE_400
            : COLORS.NEGATIVE_400
          : COLORS.SVG_DEFAULT
      }`}
      bannerName={`${
        status
          ? status === 'success'
            ? 'figureBuildings'
            : 'figureGrey'
          : 'figureChain'
      }`}
    >
      {description}
      <ActionContainer>{children}</ActionContainer>
    </Card>
  );
};

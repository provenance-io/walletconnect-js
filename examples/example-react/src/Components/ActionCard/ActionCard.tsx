import { COLORS } from 'theme';
import { Card } from '../Card';

interface Props {
  title: string;
  status?: 'success' | 'failure';
  icon: string;
  children: React.ReactNode;
}

export const ActionCard: React.FC<Props> = ({ title, status, icon, children }) => {
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
      {children}
    </Card>
  );
};

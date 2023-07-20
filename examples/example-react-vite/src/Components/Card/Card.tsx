import styled from 'styled-components';
import { COLORS, FONTS } from 'theme';
import { Sprite } from '../Sprite/Sprite';
import figureEarthImg from './figureEarth01.png';
import figureBuildingsImg from './figureBuildings01.png';
import figureChainImg from './figureChain01.png';
import figureGreyImg from './figureGrey01.png';

const allBanners = {
  figureEarth: figureEarthImg,
  figureBuildings: figureBuildingsImg,
  figureChain: figureChainImg,
  figureGrey: figureGreyImg,
};

type BannerOptions = keyof typeof allBanners;

const CardContainer = styled.div`
  width: 780px;
  min-height: 500px;
  background: white;
  box-shadow: ${COLORS.BLACK_10} 0px 4px 8px;
  @media screen and (max-width: 1080px) {
    width: 100%;
  }
`;

const Banner = styled.div<{ bannerName: BannerOptions }>`
  width: 100%;
  height: 160px;
  background-image: ${({ bannerName }) => `url(${allBanners[bannerName]})`};
  background-size: cover;
`;
const Content = styled.div`
  padding: 50px 32px;
  position: relative;
`;
const Title = styled.h1`
  font-size: 2.3rem;
  font-family: ${FONTS.SECONDARY_FONT};
  font-weight: 700;
  text-transform: capitalize;
  margin-bottom: 4px;
`;
const LogoContainer = styled.div<{ logoBg: string }>`
  position: absolute;
  height: 76px;
  width: 76px;
  z-index: 10;
  border: 2px solid ${COLORS.NEUTRAL_200};
  background: ${({ logoBg }) => logoBg};
  top: -40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  children: React.ReactNode;
  title: string;
  logoBg?: string;
  logoIcon?: string;
  logoColor?: string;
  bannerName?: BannerOptions;
}

export const Card: React.FC<Props> = ({
  children,
  title,
  logoIcon,
  logoColor = COLORS.WHITE,
  logoBg = COLORS.SVG_DEFAULT,
  bannerName = 'figureEarth',
}) => {
  return (
    <CardContainer id="actionCard">
      <Banner bannerName={bannerName} />
      <Content>
        {logoIcon && (
          <LogoContainer logoBg={logoBg}>
            <Sprite icon={logoIcon} color={logoColor} size="60px" />
          </LogoContainer>
        )}
        <Title>{title}</Title>
        {children}
      </Content>
    </CardContainer>
  );
};

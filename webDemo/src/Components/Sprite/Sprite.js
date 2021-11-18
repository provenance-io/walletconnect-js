import PropTypes from 'prop-types';
import styled, { useTheme } from 'styled-components';
import { ICON_NAMES } from 'consts';

const Svg = styled.svg`
  --secondaryColor: ${({ secondaryColor }) => secondaryColor};
  width: ${({ size, width }) => width || size};
  height: ${({ size, height }) => height || size};
  transform: ${({ flipX }) => flipX && `scaleX(-1)`} ${({ flipY }) => flipY && `scaleY(-1)`}
    ${({ spin }) => Boolean(spin) && `rotate(${spin}deg)`};
`;

const Sprite = ({ color, alt, icon, secondaryColor, ...svgIcons }) => {
  const theme = useTheme();

  // Use the variable color name if it exists, else the actual color passed in, or else default color
  const colorValue = theme[color] ? theme[color] : color || theme.ICON_PRIMARY;
  const secondaryColorValue = theme[secondaryColor]
    ? theme[secondaryColor]
    : secondaryColor || theme.WHITE;

  return (
    <Svg
      {...svgIcons}
      alt={alt || `${icon} icon`}
      color={colorValue}
      secondaryColor={secondaryColorValue}
    >
      <use href={`#${icon}`} />
    </Svg>
  );
};

Sprite.propTypes = {
  alt: PropTypes.string,
  color: PropTypes.string,
  flipX: PropTypes.bool,
  flipY: PropTypes.bool,
  height: PropTypes.string,
  icon: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string,
  size: PropTypes.string,
  spin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.string,
};

Sprite.defaultProps = {
  alt: null,
  color: '',
  flipX: false,
  flipY: false,
  height: null,
  secondaryColor: 'ICON_PRIMARY',
  size: '100%',
  spin: 0,
  width: null,
};

// Exposes Icon constant so it doesn't need to be imported separately when consuming component
Sprite.Icon = ICON_NAMES;

export default Sprite;
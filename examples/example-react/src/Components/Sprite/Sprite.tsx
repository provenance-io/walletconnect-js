import React from 'react';
import styled from 'styled-components';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';

type SvgProps = {
  alt?: string;
  animate?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  secondaryColor?: string;
  spin?: string | number;
  color?: string;
};

const Svg = styled.svg<SvgProps>`
  transform: ${({ flipX = false, flipY = false, spin = 0 }) =>
    `${flipX ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''} ${
      Boolean(spin) ? `rotate(${spin}deg)` : ''
    }`};
  transition: ${({ animate = false }) => animate && 'transform 300ms linear'};
  color: ${({ color }) => color};
`;

type SpriteProps = {
  color?: string;
  height?: string;
  icon: string;
  width?: string;
  onClick?: () => void;
  viewBox?: string;
  size?: string;
} & SvgProps;

export const Sprite = ({
  alt,
  animate = false,
  color = COLORS.SVG_DEFAULT,
  icon,
  spin = 0,
  onClick,
  height,
  width,
  size,
  ...svgIcons
}: SpriteProps) => {
  return (
    <Svg
      {...svgIcons}
      alt={alt || `${icon} icon`}
      animate={animate}
      color={color}
      spin={spin}
      onClick={onClick}
      height={height || size}
      width={width || size}
    >
      <use href={`#${icon}`} />
    </Svg>
  );
};

// Exposes Icon constant so it doesn't need to be imported separately when consuming component
Sprite.Icon = ICON_NAMES;

import React from 'react';
import styled from 'styled-components';
import {
  caret,
  check,
  copy,
  figureName,
  gear,
  hamburger,
  hash,
  key,
  logout,
  pencil,
  tag,
  usd,
  walletconnect,
} from './svgIcons';

const SvgLoader = styled.div`
  display: none;
`;

/**
 * Inject *SpriteSheet* into the root of your application or *Sprite* component won't render anything.
 *
 * `fill` and `stroke` must be set to `"currentColor"` otherwise it won't inherit `color` prop from *Sprite*.
 */
export const SpriteSheet = () => (
  <SvgLoader>
    {caret}
    {check}
    {copy}
    {figureName}
    {gear}
    {hamburger}
    {hash}
    {key}
    {logout}
    {pencil}
    {tag}
    {usd}
    {walletconnect}
  </SvgLoader>
);

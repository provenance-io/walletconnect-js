import React from 'react';
import styled from 'styled-components';
import { caret } from './svgIcons/caret';
import { check } from './svgIcons/check';
import { copy } from './svgIcons/copy';
import { figureName } from './svgIcons/figureName';
import { gear } from './svgIcons/gear';
import { hamburger } from './svgIcons/hamburger';
import { hash } from './svgIcons/hash';
import { key } from './svgIcons/key';
import { logout } from './svgIcons/logout';
import { pencil } from './svgIcons/pencil';
import { reload } from './svgIcons/reload';
import { tag } from './svgIcons/tag';
import { usd } from './svgIcons/usd';
import { walletconnect } from './svgIcons/walletconnect';

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
    {reload}
    {tag}
    {usd}
    {walletconnect}
  </SvgLoader>
);

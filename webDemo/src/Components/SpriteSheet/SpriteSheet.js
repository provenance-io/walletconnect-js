import styled from 'styled-components';
import { ICON_NAMES } from 'consts';

const Svg = styled.svg`
  display: none;
`;

/**
 * Inject *SpriteSheet* into the root of your application or *Sprite* component won't render anything.
 *
 * `fill` and `stroke` must be set to `"currentColor"` otherwise it won't inherit `color` prop from *Sprite*.
 */
const SpriteSheet = () => (
  <Svg xmlns="http://www.w3.org/2000/svg">
    <g id={ICON_NAMES.ACCOUNT}>
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    </g>
    <g id={ICON_NAMES.ADMIN}>
      <svg viewBox="0 0 20 20" fill="none">
        <path d="M8.5 7.5V4.5H11.5V7.5H8.5Z" stroke="currentColor" />
        <path d="M4.5 15.5V12.5H7.5V15.5H4.5Z" stroke="currentColor" />
        <path d="M12.5 15.5V12.5H15.5V15.5H12.5Z" stroke="currentColor" />
        <path d="M6 12.5V10H14V12.5" stroke="currentColor" />
        <path d="M10 7.5V10" stroke="currentColor" />
      </svg>
    </g>
    <g id={ICON_NAMES.APPS}>
      <svg viewBox="0 0 20 20" fill="none">
        <path
          d="M4.5 12.6667V7.33333L10 5.04167L15.5 7.33334V12.6667L10 14.9583L4.5 12.6667Z"
          stroke="currentColor"
        />
        <path d="M4.5 7.5L10 9.5L15.5 7.5" stroke="currentColor" />
        <path d="M10 9.5V14.5" stroke="currentColor" />
      </svg>
    </g>
    <g id={ICON_NAMES.ARROW}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 16">
        <path stroke="currentColor" strokeWidth="1.4" d="m14 1 7 7-7 7M21 8H0"/>
      </svg>
    </g>
    <g id={ICON_NAMES.BACK_ARROW}>
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M28 5L13 20L28 35" stroke="currentColor" strokeWidth="10%" />
      </svg>
    </g>
    <g id={ICON_NAMES.CALL_MADE}>
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z" />
      </svg>
    </g>
    <g id={ICON_NAMES.CARET}>
      <svg viewBox="0 0 9 5" fill="currentColor">
        <path d="M9 -1.43051e-06L4.68 4.5L3.93403e-07 -2.21732e-06L9 -1.43051e-06Z" />
      </svg>
    </g>
    <g id={ICON_NAMES.CHEVRON}>
      <svg viewBox="0 0 7 10" fill="none" stroke="currentColor">
        <path d="M5.81818 1L2 5L5.81818 9" strokeWidth="1" />
      </svg>
    </g>
    <g id={ICON_NAMES.CLOSE}>
      <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M8.99984 1L5.09375 5L8.99984 9" />
        <path d="M1.00016 1L4.90625 5L1.00016 9" />
      </svg>
    </g>
    <g id={ICON_NAMES.CUBES}>
      <svg viewBox="0 0 38 33" fill="none">
        <path d="M19 1L10 6V14L19 19L28 14V6L19 1Z" stroke="currentColor" />
        <path d="M19 11L10 6" stroke="currentColor" />
        <path d="M28 6L19 11V18.5" stroke="currentColor" />
        <path d="M10 14L1 19V27L10 32L19 27V19L10 14Z" stroke="currentColor" />
        <path d="M10 24L1 19" stroke="currentColor" />
        <path d="M19 19L10 24V31.5" stroke="currentColor" />
        <path d="M28 14L19 19V27L28 32L37 27V19L28 14Z" stroke="currentColor" />
        <path d="M28 24L19 19" stroke="currentColor" />
        <path d="M37 19L28 24V31.5" stroke="currentColor" />
      </svg>
    </g>
    <g id={ICON_NAMES.DISCORD}>
      <svg viewBox="0 0 245 240" fill="currentColor">
        <path d="M104 104c-5 0-10 5-10 11s5 11 10 11c6 0 11-5 11-11s-5-11-11-11zm37 0c-6 0-10 5-10 11s4 11 10 11 10-5 10-11-4-11-10-11z" />
        <path d="M190 20H56c-12 0-21 9-21 21v135c0 11 9 20 21 20h113l-5-18 12 12 13 11 21 19V41c0-12-9-21-20-21zm-39 131l-7-9c13-3 18-11 18-11l-11 5c-5 3-10 4-15 5a70 70 0 01-40-5c-3 0-5-2-8-3l-1-1-3-2c0 1 5 9 18 12l-7 9c-22-1-30-16-30-16 0-32 14-58 14-58 14-11 28-10 28-10l1 1c-18 5-26 13-26 13l6-3c10-5 19-6 22-6h2a85 85 0 0151 9s-8-8-25-13l1-1s14-1 28 10c0 0 14 26 14 58 1 0-8 15-30 16z" />
      </svg>
    </g>
    <g id={ICON_NAMES.FIGURE}>
      <svg fill="currentColor" viewBox="0 0 49 80">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0H48.2403V15.9718H0V0ZM0 80V32.0084H48.2403V47.9802H16.0546V80H0Z"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.GITHUB}>
      <svg fill="none" viewBox="0 0 1024 1024">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M512 0a512 512 0 00-162 998c26 4 35-11 35-25v-95c-129 24-162-31-173-60-5-15-30-60-52-72-18-10-44-34-1-34 41-1 69 37 79 52 46 78 120 56 149 42 5-33 18-55 33-68-114-13-233-57-233-253 0-56 20-102 52-137-5-13-23-66 5-136 0 0 43-14 141 52a475 475 0 01256 0c98-66 141-52 141-52 28 70 10 123 5 136 33 35 53 81 53 137 0 197-120 240-234 253 19 16 35 47 35 95l-1 140c0 14 10 30 35 25A513 513 0 00512 0z"
          clipRule="evenodd"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.HASH}>
      <svg viewBox="0 0 40 40" fill="none">
        <rect
          x="20"
          y="3.73654"
          width="23"
          height="23"
          transform="rotate(45 20 3.73654)"
          stroke="currentColor"
        />
        <path d="M27.7782 12.2218L13.9896 26.0104" stroke="currentColor"/>
        <path d="M11.5147 11.5147L17.8787 17.8787" stroke="currentColor"/>
        <path d="M20 20L28.4853 28.4853" stroke="currentColor"/>
      </svg>
    </g>
    <g id={ICON_NAMES.HELP}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    </g>
    <g id={ICON_NAMES.HELP_OUTLINE}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      </svg>
    </g>
    <g id={ICON_NAMES.IN_PROGRESS}>
      <svg viewBox="0 0 18 18" fill="none">
        <path
          d="M9 0.5C10.6811 0.5 12.3245 0.998516 13.7223 1.93251C15.1202 2.8665 16.2096 4.19402 16.853 5.74719C17.4963 7.30036 17.6646 9.00943 17.3367 10.6583C17.0087 12.3071 16.1992 13.8217 15.0104 15.0104C13.8217 16.1992 12.3071 17.0087 10.6583 17.3367C9.00943 17.6646 7.30036 17.4963 5.74719 16.853C4.19402 16.2096 2.8665 15.1202 1.93251 13.7223C0.998516 12.3245 0.5 10.6811 0.5 9"
          stroke="currentColor"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.INVENTORY}>
      <svg viewBox="0 0 20 20" fill="none">
        <rect x="4" y="5" width="1" height="1" fill="currentColor" />
        <rect x="6" y="5" width="10" height="1" fill="currentColor" />
        <rect x="4" y="8" width="1" height="1" fill="currentColor" />
        <rect x="6" y="8" width="10" height="1" fill="currentColor" />
        <rect x="4" y="11" width="1" height="1" fill="currentColor" />
        <rect x="6" y="11" width="10" height="1" fill="currentColor" />
        <rect x="4" y="14" width="1" height="1" fill="currentColor" />
        <rect x="6" y="14" width="10" height="1" fill="currentColor" />
      </svg>
    </g>
    <g id={ICON_NAMES.KEY}>
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
      </svg>
    </g>
    <g id={ICON_NAMES.LOGOUT}>
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
      </svg>
    </g>
    <g id={ICON_NAMES.MENU}>
      <svg viewBox="0 0 20 11" fill="none">
        <rect width="20" height="1" fill="currentColor" />
        <rect y="5" width="20" height="1" fill="currentColor" />
        <rect y="10" width="20" height="1" fill="currentColor" />
      </svg>
    </g>
    <g id={ICON_NAMES.MOON}>
      <svg viewBox="-25 -20 170 170" fill="currentColor">
        <path d="M110 94a65 65 0 01-78 30c-3-1-11-3-19-9l-3-6 4-2c10 0 14-1 18-3 4-1 6-4 7-8l1-4c2-2 3-2 5-2 1 0 3 2 4 1l-2-1c-1-2-3-4-2-6l5-2c4-1 2-5-1-7-5-3-17-11-8-16l9-2 10-5C74 42 80 25 74 9c-1-2-4-6-2-8h3a64 64 0 019 4c32 17 43 57 26 89z" />
      </svg>
    </g>
    <g id={ICON_NAMES.PARTICIPATION}>
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="8" r="3.5" stroke="currentColor" />
        <path
          d="M15 16C15 14 12.7614 11.5 10 11.5C7.23858 11.5 5 13.5 5 16"
          stroke="currentColor"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.PENDING}>
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" />
        <path d="M10 5.5V10L13.5 12.5" stroke="currentColor" />
      </svg>
    </g>
    <g id={ICON_NAMES.LOGO}>
      <svg fill="none" viewBox="0 0 22 32">
        <path
          fill="currentColor"
          d="M17.2 3.5L11.5 0 5.7 3.5 0 7v21.6L5.8 32v-9.9l5.7 3.5 5.8-3.5 5.7-3.5V7l-5.8-3.5zm-5.7 16.3l-5.8-3.5v-5.8L11.5 7l5.7 3.5v5.8l-5.7 3.5z"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.REPORTS}>
      <svg viewBox="5 3 10 14" fill="none">
        <path d="M6 4H10.5L14.5 8V15.5H6V4Z" stroke="currentColor" />
        <path d="M10.5 4V8.5H14.5" stroke="currentColor" />
      </svg>
    </g>
    <g id={ICON_NAMES.SEARCH}>
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="9.02128" cy="9.02128" r="6.52128" stroke="currentColor" />
        <path d="M13.9362 13.9362L18.5 18.5" stroke="currentColor" />
      </svg>
    </g>
    <g id={ICON_NAMES.SETTINGS}>
      <svg viewBox="0 0 20 20" fill="none">
        <path
          d="M5.34315 9.17157C3.92894 10.5858 2.51472 12 3.22183 14.1213L13.1213 4.22183C11 3.51472 9.58579 4.92893 8.17158 6.34315L5.34315 9.17157Z"
          stroke="currentColor"
        />
        <path
          d="M6.05029 8.46447L14.5356 16.9497L15.9498 15.5355L7.81806 7.40381"
          stroke="currentColor"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.SHARED_POOLS}>
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="13.5" cy="6.5" r="2" stroke="currentColor" />
        <circle cx="6.5" cy="10" r="2" stroke="currentColor" />
        <circle cx="13.5" cy="13.5" r="2" stroke="currentColor" />
        <path d="M8.22461 8.97343L11.7069 7.36621" stroke="currentColor" />
        <path d="M8.22456 11L11.8311 12.6645" stroke="currentColor" />
      </svg>
    </g>
    <g id={ICON_NAMES.SUN}>
      <svg viewBox="0 -10 150 150" fill="currentColor">
        <path d="M64 30a34 34 0 100 68 34 34 0 000-68zM57 24h14a2 2 0 002-3L66 2a2 2 0 00-4 0l-7 19v2l2 1zM97 41a2 2 0 002 1l2-2 8-19a2 2 0 00-2-2l-19 8a2 2 0 00-1 4l10 10zM126 62l-19-7h-2l-1 2v14a2 2 0 003 2l19-7 2-2-2-2zM101 88a2 2 0 00-4-1L87 97a2 2 0 001 4l19 8v1a2 2 0 002-3l-8-19zM71 104H57l-2 1v2l7 19 2 2 2-2 7-19a2 2 0 00-2-3zM31 87l-2-1-2 2-8 19v2a2 2 0 002 0l19-8a2 2 0 001-4L31 87zM22 73h1l1-2V57l-1-2h-2L2 62a2 2 0 000 4l19 7h1zM27 40a2 2 0 004 1l10-10a2 2 0 00-1-4l-19-8h-2v2l8 19z" />
      </svg>
    </g>
    <g id={ICON_NAMES.WARNING}>
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    </g>
    <g id={ICON_NAMES.CHECK}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 6" fill="none">
        <path stroke="currentColor" d="M1.27 2.4l1.86 2 3.74-4"/>
      </svg>
    </g>
    <g id={ICON_NAMES.CIRCLE_ARROW}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 65 65">
        <path stroke="currentColor" strokeWidth="4" d="M29 46l10-13-10-14m4 44a30 30 0 11-1-61 30 30 0 011 61z"/>
      </svg>
    </g>
  </Svg>
);

export default SpriteSheet;

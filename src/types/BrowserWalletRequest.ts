import { BROWSER_EVENTS } from '../consts';

export type BrowserEventKey = keyof typeof BROWSER_EVENTS;
export type BrowserEventValue = typeof BROWSER_EVENTS[BrowserEventKey];

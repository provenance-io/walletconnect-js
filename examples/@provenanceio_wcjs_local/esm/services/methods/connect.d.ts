import type { Broadcast, WCSState, WCSSetState } from '../../types';
interface ConnectProps {
    state: WCSState;
    setState: WCSSetState;
    resetState: () => void;
    broadcast: Broadcast;
    customBridge?: string;
    startConnectionTimer: () => void;
    getState: () => WCSState;
}
export declare const connect: ({ state, setState, resetState, broadcast, customBridge, startConnectionTimer, getState, }: ConnectProps) => Promise<void>;
export {};

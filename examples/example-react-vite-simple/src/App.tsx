import { useWalletConnect } from '@provenanceio/walletconnect-js';

export const App = () => {
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        WalletConnectState: {JSON.stringify(walletConnectState)}
      </div>
      <div style={{ marginBottom: '30px', fontWeight: 'bold' }}>
        STATUS: {walletConnectState.status}
      </div>

      {walletConnectState.status === 'connected' ? (
        <button onClick={() => wcs.disconnect()}>disconnect</button>
      ) : (
        <button onClick={() => wcs.init({ walletAppId: 'figure_hosted_test' })}>
          connect
        </button>
      )}
    </div>
  );
};

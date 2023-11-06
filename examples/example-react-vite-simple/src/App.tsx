import { useWalletConnect } from '@provenanceio/walletconnect-js';

export const App = () => {
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const isConnected = walletConnectState.status === 'connected';

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <b>WalletConnectState:</b> {JSON.stringify(walletConnectState)}
      </div>
      <div style={{ marginBottom: '30px' }}>
        <b>Connector:</b> {JSON.stringify(wcs.getConnector()) || 'n/a'}
      </div>
      <div
        style={{ marginBottom: '30px', fontWeight: 'bold', color: 'palevioletred' }}
      >
        Bridge (Connector): {wcs.getConnector()?.bridge || 'n/a'}
      </div>
      <div style={{ marginBottom: '30px', fontWeight: 'bold', color: 'indianred' }}>
        Bridge (WalletConnectState): {walletConnectState.bridge || 'n/a'}
      </div>
      <div style={{ marginBottom: '30px', fontWeight: 'bold' }}>
        STATUS: {walletConnectState.status}
      </div>

      {isConnected ? (
        <button onClick={() => wcs.disconnect()}>disconnect</button>
      ) : (
        <button
          onClick={() =>
            wcs.init({
              walletAppId: 'figure_hosted_test',
              bridge:
                'wss://test.figure.tech/service-wallet-connect-bridge/ws/external',
            })
          }
        >
          connect
        </button>
      )}
    </div>
  );
};

import {
  WalletConnectService,
  useWalletConnect,
} from '@provenanceio/walletconnect-js';

export const App = () => {
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();

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
        Bridge: {wcs.getConnector()?.bridge || 'n/a'}
      </div>
      <div style={{ marginBottom: '30px', fontWeight: 'bold' }}>
        STATUS: {walletConnectState.status}
      </div>

      {walletConnectState.status === 'connected' ? (
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

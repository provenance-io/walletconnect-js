interface Window {
  provenance?: {
    version: string;
    isProvenance: boolean;
  };
  figureWalletExtension?: {
    version: string;
    isFigure: boolean;
  };
  wcjs?: {
    version?: string;
    getState?: () => WCSState;
  };
}

import { useEffect } from "react";
import { WINDOW_MESSAGES } from "@provenanceio/walletconnect-js";
import { Button } from "Components";

interface Props {
  walletConnectService: {
    addListener: (a: string, b: (results: any) => void) => void;
    removeListener: (a: string, b: (results: any) => void) => void;
    connect: () => void;
  };
  setResults: (results: any) => void;
}

export const Connect: React.FC<Props> = ({
  walletConnectService,
  setResults,
}) => {
  useEffect(() => {
    const connectEvent = (result: any) => {
      setResults({
        action: "connect",
        status: "success",
        message: "WalletConnectJS | Connected",
        data: result,
      });
    };
    walletConnectService.addListener(WINDOW_MESSAGES.CONNECTED, connectEvent);

    return () => {
      walletConnectService.removeListener(
        WINDOW_MESSAGES.CONNECTED,
        connectEvent
      );
    };
  }, [walletConnectService, setResults]);

  return (
    <Button width="200px" onClick={walletConnectService.connect}>
      Connect
    </Button>
  );
};

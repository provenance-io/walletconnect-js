import ReactDOM from "react-dom";
import styled from "styled-components";
import { WalletConnectContextProvider } from "@provenanceio/walletconnect-js";
import { StrictMode } from "react";
import { App } from "./App";
import figureSvg from "./img/figureLogo.svg";
// Bring in Google Fonts and base styles
import "./base.css";

const WalletIcon = styled.img`
  background: #ffffff;
  border-radius: 4px;
  height: 30px;
  width: 30px;
`;

const customDesktopWallet = {
  onClick: (e, encodedQRCodeUrl) => {
    window.location.href = `https://test.figure.com/dashboard/wallet?${encodedQRCodeUrl}`;
  },
  walletTitle: "Figure Wallet",
  children: <WalletIcon src={figureSvg} alt="figure"/>
};

ReactDOM.render(
  <StrictMode>
    <WalletConnectContextProvider
      network="testnet"
      customDesktopWallet={customDesktopWallet}
    >
      <div id="portal" />
      <App />
    </WalletConnectContextProvider>
  </StrictMode>,
  document.getElementById("root")
);

import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from 'Components';
import { ActionContainer } from './ActionContainer';

const Info = styled.div`
  font-size: 1.4rem;
  margin-right: 40px;
`;
const Bold = styled.span`
  font-weight: 700;
`;

export const SignJWT = ({ walletConnectService, loading, setPopup }) => {
  const color = '#55AA55';
  const [kycStatus, setKycStatus] = useState('');
  const [kycStatusLoading, setKycStatusLoading] = useState(false);

  useEffect(() => {
    const getWalletKYC = (address, signedJWT) => {
      if (!address || !signedJWT) return;
      const accountAttributesUrl = 'https://api.test.provenance.io/provenance/attribute/v1/attributes';
      const fullUrl = `${accountAttributesUrl}/${address}`;
      const request = new XMLHttpRequest();
      setKycStatusLoading(true);
      request.onload = () => {
        const { response } = request;
        const { attributes = [] } = response;
        const newKycStatus = attributes.filter(({ name }) => name.includes('kyc-aml')).length ? 'KYC Approved!' : 'Non-KYC Account';
        setKycStatus(newKycStatus);
        setKycStatusLoading(false);
      };
      request.open('GET', fullUrl);
      request.send();
    };

    walletConnectService.addListener(WINDOW_MESSAGES.SIGN_JWT_COMPLETE, ({ signedJWT, address }) => {
      setPopup(`Successfully Signed JWT!`, 'success');
      getWalletKYC(address, signedJWT);
    });
    walletConnectService.addListener(WINDOW_MESSAGES.SIGN_JWT_FAILED, ({ error }) => {setPopup(`Signing Message Failed! ${error}`, 'failure', 5000)});

    return () => {
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.SIGN_JWT_COMPLETE);
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.SIGN_JWT_FAILED);
    }
  }, [walletConnectService, setPopup]);

  return (
    <ActionContainer color={color} justify="space-between" loading={loading}>
      <Info>Current KYC Status: <Bold>{kycStatusLoading ? 'Loading...' : kycStatus || 'Unknown'}</Bold></Info>
      <Button
        color={color}
        loading={loading}
        onClick={() => walletConnectService.signJWT()}
      >
        Sign JWT
      </Button>
    </ActionContainer>
  );
};

SignJWT.propTypes = {
  walletConnectService: PropTypes.shape({
    signJWT: PropTypes.func,
    addListener: PropTypes.func,
    removeAllListeners: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool,
  setPopup: PropTypes.func.isRequired,
};

SignJWT.defaultProps = {
  loading: false,
};

import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { decodeJWT } from 'utils';
import { CountdownTimer } from '../CountdownTimer';

const Wrapper = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  background: #2d2461;
  padding: 4px 40px;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  color: white;
  z-index: 90;
  @media (max-width: 1280px) {
    padding: 14px 20px;
  }
  @media (max-width: 1150px) {
    justify-content: center;
  }
  @media (max-width: 780px) {
    padding: 6px;
  }
`;
const Title = styled.div`
  margin-right: 10px;
`;


export const Subheader = ({ signedJWT, address }) => {
  // Need to decode signedJWT and note the expiration time
  const { payload: signedJWTPayload, valid: signedJWTValid } = decodeJWT(signedJWT, { addr: address });
  // Pull out expiration date for jwt (in seconds)
  const { exp: signedJWTExpiration } = signedJWTPayload;
  // Get current time in seconds and compare it to expiration
  const timeNow = Math.ceil(new Date().getTime() / 1000);
  // const expiresIn = signedJWTExpiration - timeNow;
  const expiresIn = 310; // Temp testing, just set to 5min10sec ***REMOVE ME***
  
  const sessionWarningSoon = () => {
    console.log('Your authentication token will expire in a little bit, click here to refresh timeout.');
  };
  const sessionWarning = () => {
    console.log('Your authentication token will expire soon, click here to refresh timeout.');
  };
  const sessionExpired = () => {
    console.log('Your authentication token has expired, you must refresh your timeout to perform any actions.');
  }

  return (
    signedJWTValid ? (
      <Wrapper>
        <Title>Signed JWT Expires In:</Title>
        <CountdownTimer
          start={expiresIn}
          onEnd={sessionExpired}
          timeEvents={{
            300: sessionWarning,
            305: sessionWarningSoon,
          }}
        />
      </Wrapper>
    ) : null
  );
};

Subheader.propTypes = {
  signedJWT: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
}
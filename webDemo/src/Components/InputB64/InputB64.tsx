import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';
import Input from '../Input';
import Button from '../Button';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;
const StyledButton = styled(Button)`

`;
const DecodeBtn = styled.button`
  position: absolute;
  border: none;
  font-size: 1.2rem;
  right: 12px;
  color: white;
  top: 6px;
  cursor: pointer;
  background: #42368E;
  padding: 8px 12px;
  border-radius: 5px;
  &:hover {
    background: #20146A;
  }
  &:active {
    background: #100148;
  }
`;
const ButtonRow = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  Button {
    margin-left: 10px;
  }
`;
const DecodeMenu = styled.div`
  background: white;
  padding: 16px;
  margin-bottom: 60px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;
const DecodeTitle = styled.div`
  font-size: 1.6rem;
  display: inline;
  flex-grow: 1;
  align-self: center;
  margin-bottom: 20px;
`;

export const InputB64 = ({ value, onChange, decodeOpen, setDecodeOpen, ...props }) => {
  const [addresses, setAddresses] = useState([]);
  const [proto, setProto] = useState({ oldValue: '', newValue: ''});

  const applyDecodeValue = () => {
    let originalDecodedString = atob(value);
    // Find and replace all old values with new values
    // Add in new addresses
    addresses.forEach(({ oldValue, newValue}) => {
      originalDecodedString = originalDecodedString.replaceAll(oldValue, newValue);
    })
    // Add in new proto
    originalDecodedString = originalDecodedString.replaceAll(proto.oldValue, proto.newValue);
    // Encode string as b64
    const newEncodedString = btoa(originalDecodedString);
    // Close decoder
    setDecodeOpen(false);
    // Update input field
    onChange(newEncodedString);
  }

  const decodeB64Message = () => {
    const decodedString = atob(value);
    // Pull out the proto
    const findProto = (remainingString) => {
      let startAt = remainingString.indexOf('$/');
      if (startAt > -1) {
        const endAt = remainingString.indexOf(')');
        return remainingString.slice(startAt + 2, endAt - 4);
      }
      startAt = remainingString.indexOf('/');
      const endAt = remainingString.indexOf('\x12');
      return remainingString.slice(startAt + 1, endAt);
    };
    // Pull out all addresses
    const foundAddresses = [];
    const findAddress = (remainingString) => {
      const addressLength = 41;
      const addressPrefix = 'tp';
      const tpIndex = remainingString.indexOf(addressPrefix);
      if (tpIndex > -1) {
        const address = remainingString.slice(tpIndex, (tpIndex + addressLength));
        foundAddresses.push({ oldValue: address, newValue: address });
        const updatedString = remainingString.split(address).join('');
        findAddress(updatedString);
      }
    }
    findAddress(decodedString);
   
    const foundProto = findProto(decodedString);
    setProto({ oldValue: foundProto, newValue: foundProto });
    setAddresses(foundAddresses);
  };

  const openDecoder = () => {
    setDecodeOpen(true);
    decodeB64Message();
  };

  const changeSingleAddress = (index, newValue) => {
    const newAddresses = [...addresses];
    newAddresses[index].newValue = newValue;
    setAddresses(newAddresses);
  }

  return (
    <Wrapper>
      <Input {...props} disabled={decodeOpen} value={value} onChange={onChange} />
      {!decodeOpen && value && <DecodeBtn onClick={openDecoder}>Decode</DecodeBtn>}
      {decodeOpen && (
        <DecodeMenu>
          <DecodeTitle>Decode Menu (Note: Feature is beta)</DecodeTitle>
          <ButtonRow>
            <StyledButton width="50px" onClick={applyDecodeValue}>Apply</StyledButton>
            <StyledButton width="50px" color="#888888" onClick={() => setDecodeOpen(false)}>Cancel</StyledButton>
          </ButtonRow>
          <Input
            width="100%"
            value={proto.newValue}
            label="Proto"
            placeholder="Enter Proto"
            onChange={(newValue) => setProto({ oldValue: proto.oldValue, newValue })}
            bottomGap
          />
          {addresses.map((address, index) => (
            <Input
              key={index} // eslint-disable-line react/no-array-index-key
              width="100%"
              value={address.newValue}
              label={`Address #${index + 1}`}
              placeholder="Enter Address"
              onChange={(newValue) => changeSingleAddress(index, newValue)}
              bottomGap
            />
          ))}
        </DecodeMenu>
      )}
    </Wrapper>
  );
};

InputB64.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  decodeOpen: PropTypes.bool.isRequired,
  setDecodeOpen: PropTypes.func.isRequired,
};
InputB64.defaultProps = {
  value: '',
  onChange: () => {},
};
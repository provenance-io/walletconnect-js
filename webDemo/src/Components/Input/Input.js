import styled from 'styled-components';
import PropTypes from 'prop-types';

const InputContainer = styled.div`
  position: relative;
  flex-basis: ${({ width }) => width};
  display: flex;
`;
const StyledInput = styled.input`
  padding: 4px 10px;
  height: 30px;
  width: 100%;
  box-sizing: content-box;
  border-radius: 0;
  margin-right: 4px;
  border: 1px solid #DDDDDD;
`;
const Label = styled.label`
  font-size: 1.0rem;
  font-weight: 700;
  position: absolute;
  top: -16px;
  left: 0;
`;

const Input = ({ className, label, value, onChange, placeholder, width }) => (
  <InputContainer width={width} className={className}>
    {label && <Label>{label}</Label>}
    <StyledInput
      value={value}
      placeholder={placeholder}
      onChange={({ target }) => onChange(target.value)}
    />
  </InputContainer>
);

Input.propTypes = {
  className: PropTypes.string,
  width: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
Input.defaultProps = {
  className: '',
  width: '100%',
  label: '',
  value: '',
  onChange: () => {},
  placeholder: 'Enter Value',
};

export default Input;

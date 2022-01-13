import styled from 'styled-components';
import PropTypes from 'prop-types';

const InputContainer = styled.div`
  position: relative;
  flex-basis: ${({ width }) => width};
  display: flex;
  ${({ bottomGap }) => bottomGap && `
    margin-bottom: 36px;
  ` }
`;
const StyledInput = styled.input`
  padding: 4px 10px;
  height: 30px;
  width: 100%;
  box-sizing: content-box;
  border-radius: 0;
  margin-right: 4px;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
`;
const Label = styled.label`
  font-size: 1.0rem;
  font-weight: 700;
  position: absolute;
  top: -20px;
  left: 0;
`;

const Input = ({ className, label, value, onChange, placeholder, width, bottomGap }) => (
  <InputContainer width={width} className={className} bottomGap={bottomGap}>
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
  bottomGap: PropTypes.bool,
};
Input.defaultProps = {
  className: '',
  width: '100%',
  label: '',
  value: '',
  onChange: () => {},
  placeholder: 'Enter Value',
  bottomGap: false,
};

export default Input;

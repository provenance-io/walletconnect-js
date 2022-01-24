import styled from 'styled-components';
import PropTypes from 'prop-types';

const SelectContainer = styled.div`
  margin-bottom: 42px;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 300px;
`;
const StyledSelect = styled.select`
  width: 300px;
  padding: 14px 18px;
  border-radius: 4px;
  margin: 0;
  border: 1px solid #dddddd;
  font-size: 1.4rem;
  background: #fdfdfd;
  cursor: pointer;
  color: #999999;
  &:focus, &:focus-visible, &:active {
    outline: none;
  }
  &::placeholder {
    color: #dddddd
  }
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
`;
const DropdownIcon = styled.div`
  position: absolute;
  display: flex;
  top: 13px;
  right: 15px;
  align-items: center;
  justify-content: center;
  color: #aaaaaa;
  pointer-events: none;
  cursor: pointer;
  font-size: 2.5rem;
  transform: rotate(90deg);
  font-weight: bold;
  background: #fdfdfd;
  box-shadow: 0 20px 12px 10px white;
`;

const Dropdown = ({
  options,
  onChange,
  value,
  placeholder,
}) => {
  const renderOptions = () => options.map((title) => (
    <option key={title} value={title}>{title}</option>
  ));

  return (
    <SelectContainer>
      <StyledSelect onChange={({ target }) => onChange(target.value)} defaultValue={value || placeholder}>
        <option value={placeholder} disabled>{placeholder}</option>
        {renderOptions()}
      </StyledSelect>
      <DropdownIcon>&#8227;</DropdownIcon>
    </SelectContainer>
  );
};

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};
Dropdown.defaultProps = {
  placeholder: "Select Method/Action",
  value: '',
};

export default Dropdown;

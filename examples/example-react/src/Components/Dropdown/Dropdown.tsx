import styled from 'styled-components';

const SelectContainer = styled.div`
  margin-bottom: 42px;
  position: relative;
  width: 450px;
`;
const StyledSelect = styled.select`
  width: 450px;
  padding: 14px 18px;
  padding-right: 30px;
  border-radius: 4px;
  margin: 0;
  border: 1px solid rgba(60, 60, 100, 0.9);
  background: rgba(10, 10, 30, 0.9);
  font-size: 1.4rem;
  cursor: pointer;
  color: white;
  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
`;
const DropdownIcon = styled.div`
  position: absolute;
  top: 13px;
  right: 10px;
  background: transparent;
  color: white;
  pointer-events: none;
  cursor: pointer;
  font-size: 2.5rem;
  transform: rotate(90deg);
  font-weight: bold;
`;

interface Props {
  options: string[];
  onChange: (value: any) => void;
  placeholder?: string;
  value: string;
}

export const Dropdown: React.FC<Props> = ({
  options,
  onChange,
  value,
  placeholder = 'Select Method/Action',
}) => {
  const renderOptions = () =>
    options.map((title) => (
      <option key={title} value={title}>
        {title}
      </option>
    ));

  return (
    <SelectContainer>
      <StyledSelect
        onChange={({ target }) => onChange(target.value)}
        defaultValue={value || placeholder}
      >
        <option value={placeholder} disabled>
          {placeholder}
        </option>
        {renderOptions()}
      </StyledSelect>
      <DropdownIcon>&#8227;</DropdownIcon>
    </SelectContainer>
  );
};

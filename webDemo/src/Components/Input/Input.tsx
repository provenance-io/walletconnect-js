import styled from "styled-components";

const InputContainer = styled.div<{ width: string; bottomGap?: boolean }>`
  position: relative;
  flex-basis: ${({ width }) => width};
  display: flex;
  ${({ bottomGap }) =>
    bottomGap &&
    `
    margin-bottom: 36px;
  `}
`;
const StyledInput = styled.input`
  padding: 0 16px;
  height: 40px;
  width: 100%;
  box-sizing: content-box;
  border-radius: 0;
  margin-right: 4px;
  border: 1px solid rgba(90, 90, 200, 0.9);
  background: rgba(60, 60, 140, 0.4);
  color: white;
  border-radius: 4px;
`;
const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 700;
  position: absolute;
  top: -24px;
  left: 0;
`;

interface Props {
  className?: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
  bottomGap?: boolean;
  disabled?: boolean;
}

export const Input: React.FC<Props> = ({
  className,
  label,
  value,
  onChange,
  placeholder = "Enter Value",
  width = "100%",
  bottomGap = false,
  disabled = false,
}) => (
  <InputContainer width={width} className={className} bottomGap={bottomGap}>
    {label && <Label>{label}</Label>}
    <StyledInput
      value={value}
      placeholder={placeholder}
      onChange={({ target }) => onChange(target.value)}
      disabled={disabled}
    />
  </InputContainer>
);

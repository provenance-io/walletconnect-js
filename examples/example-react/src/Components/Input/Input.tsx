import styled from 'styled-components';
import { COLORS, FONTS } from 'theme';

const InputContainer = styled.div<{ width: string; bottomGap?: boolean }>`
  flex-basis: ${({ width }) => width};
  display: flex;
  flex-direction: column;
  ${({ bottomGap }) =>
    bottomGap &&
    `
    margin-bottom: 20px;
  `}
`;
const StyledInput = styled.input`
  width: 100%;
  font-family: ${FONTS.PRIMARY_FONT};
  font-weight: 400;
  height: 48px;
  font-size: 1.6rem;
  color: ${COLORS.NEUTRAL_500};
  border: 1px solid ${COLORS.NEUTRAL_300};
  background: ${COLORS.WHITE};
  border-radius: 4px;
  padding: 10px 16px;
  outline: none;
  appearance: none;
  box-sizing: border-box;
  transition: 300ms all;
  &:active,
  &:focus {
    outline: 1px solid ${COLORS.PRIMARY_300};
  }
  &::placeholder {
    color: ${COLORS.NEUTRAL_200};
  }
`;
const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 3px;
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
  placeholder = 'Enter Value',
  width = '100%',
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

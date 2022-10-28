import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS, FONTS } from 'theme';
import { Sprite } from '../Sprite/Sprite';

const DropdownContainer = styled.div<{ bottomGap?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ bottomGap }) =>
    bottomGap &&
    `
    margin-bottom: 20px;
  `}
`;
const SelectContainer = styled.div`
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid ${COLORS.NEUTRAL_300};
  display: inline-flex;
  justify-content: flex-start;
  height: 50px;
  position: relative;
  transition: 300ms all;
  user-select: none;
  width: 450px;
  max-width: 100%;
`;
const StyledSelect = styled.select`
  width: 100%;
  font-family: ${FONTS.PRIMARY_FONT};
  font-weight: 400;
  height: 100%;
  font-size: 1.6rem;
  color: ${COLORS.NEUTRAL_700};
  padding: 10px 40px 10px 16px;
  border-radius: inherit;
  border: none;
  outline: none;
  background: none;
  appearance: none;
`;
const DropdownIcon = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 20;
  background: linear-gradient(
    270deg,
    ${COLORS.WHITE} 20%,
    ${COLORS.TRANSPARENT} 100%
  );
  width: 80px;
`;
const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 3px;
`;

interface Props {
  options: string[];
  onChange: (value: any) => void;
  value: string;
  label?: string;
  bottomGap?: boolean;
}

export const Dropdown: React.FC<Props> = ({
  options,
  onChange,
  value,
  label,
  bottomGap,
}) => {
  const renderOptions = () =>
    options.map((title) => (
      <option key={title} value={title}>
        {title}
      </option>
    ));

  return (
    <DropdownContainer bottomGap={bottomGap}>
      {label && <Label>{label}</Label>}
      <SelectContainer>
        <StyledSelect
          onChange={({ target }) => onChange(target.value)}
          defaultValue={value}
        >
          <option disabled />
          {renderOptions()}
        </StyledSelect>
        <DropdownIcon>
          <Sprite icon={ICON_NAMES.CARET} color={COLORS.NEUTRAL_400} size="16px" />
        </DropdownIcon>
      </SelectContainer>
    </DropdownContainer>
  );
};

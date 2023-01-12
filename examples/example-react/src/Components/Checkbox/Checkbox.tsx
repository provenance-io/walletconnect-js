import { Sprite } from 'Components';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS } from 'theme';

interface StyledProps {
  disabled?: boolean;
  labelClick?: boolean;
}

const CheckboxContainer = styled.div<StyledProps>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  label {
    ${({ disabled, labelClick }) =>
      labelClick && `cursor: ${disabled ? 'not-allowed' : 'pointer'};`}
  }
  display: flex;
  margin-bottom: 10px;
`;
const StyledCheckbox = styled.div<StyledProps>`
  height: 20px;
  width: 20px;
  border: 2px solid ${COLORS.PRIMARY_500};
  border-radius: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg {
    position: absolute;
    z-index: 1;
  }
  &:disabled {
    user-select: none;
    cursor: not-allowed;
  }
`;
const Label = styled.label`
  color: ${COLORS.NEUTRAL_500};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 2.24rem;
  flex-basis: 100%;
  margin-left: 10px;
  user-select: none;
`;

interface Props {
  checked?: boolean;
  onChange: (e: any) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  labelClick?: boolean;
}

export const Checkbox: React.FC<Props> = ({
  checked,
  onChange,
  label,
  className,
  disabled,
  labelClick = true,
  ...rest
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <CheckboxContainer
      className={className}
      disabled={disabled}
      labelClick={labelClick}
      {...rest}
      onClick={() => {
        if (labelClick) handleClick();
      }}
    >
      <StyledCheckbox onClick={handleClick} disabled={disabled} tabIndex={0}>
        {checked && (
          <Sprite icon={ICON_NAMES.CHECK} size="1.8rem" color={COLORS.PRIMARY_600} />
        )}
      </StyledCheckbox>
      {label && <Label>{label}</Label>}
    </CheckboxContainer>
  );
};

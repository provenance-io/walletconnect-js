import styled from 'styled-components';
import { Loading } from 'Components';
import { COLORS, FONTS } from 'theme';

const StyledButton = styled.button<{ width: string }>`
  align-items: center;
  background: ${COLORS.PRIMARY_600};
  border-radius: 4px;
  border: none;
  color: ${COLORS.WHITE};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  font-size: 1.6rem;
  font-family: ${FONTS.PRIMARY_FONT};
  font-weight: 500;
  height: 48px;
  justify-content: center;
  letter-spacing: 0;
  max-width: ${({ width }) => width};
  min-width: 167px;
  padding: 11px 16px;
  transition: 250ms all;
  user-select: none;
  white-space: nowrap;
  &:hover:not(:disabled) {
    background: ${COLORS.PRIMARY_500};
  }
  &:active:not(:disabled) {
    filter: contrast(90%);
  }
  &:disabled {
    filter: grayscale(80%);
  }
`;
const ButtonContent = styled.div``;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  title?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<Props> = ({
  className,
  onClick = () => {},
  children,
  disabled = false,
  width = 'auto',
  title,
  type = 'button',
  loading = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <StyledButton
      title={title}
      className={className}
      onClick={handleClick}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleClick();
        }
      }}
      disabled={disabled || loading}
      width={width}
      type={type}
    >
      <ButtonContent>{loading ? <Loading /> : children}</ButtonContent>
    </StyledButton>
  );
};

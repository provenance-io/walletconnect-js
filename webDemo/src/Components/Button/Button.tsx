import styled from "styled-components";
import { Loading } from "Components";

const StyledButton = styled.button<{ width: string }>`
  max-width: ${({ width }) => width};
  ${({ width }) => width === "auto" && "min-width: 150px"};
  align-items: center;
  background: ${({ color }) => color};
  white-space: nowrap;
  border-radius: 6px;
  border: 1px solid ${({ color }) => color};
  color: white;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: flex;
  justify-content: center;
  letter-spacing: 0.07rem;
  transition: 250ms all;
  user-select: none;
  font-size: 1.2rem;
  height: 40px;
  padding: 0 30px;
  &:hover:not(:disabled) {
    filter: saturate(175%);
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
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  title?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<Props> = ({
  className,
  color = "#376FE8",
  onClick = () => {},
  children,
  disabled = false,
  width = "auto",
  title,
  type = "button",
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
      color={color.toUpperCase()}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
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

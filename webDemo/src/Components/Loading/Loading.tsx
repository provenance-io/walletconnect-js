import styled from "styled-components";

const Svg = styled.svg`
  margin: auto;
  display: block;
`;

interface Props {
  className?: string;
  color?: string;
  height?: string;
  width?: string;
}

export const Loading: React.FC<Props> = ({
  className,
  color = "#eeeeee",
  height = "20px",
  width = "20px",
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    className={className}
    height={height}
    width={width}
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke={color}
      strokeWidth="10"
      r="35"
      strokeDasharray="164.93361431346415 56.97787143782138"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      />
    </circle>
  </Svg>
);

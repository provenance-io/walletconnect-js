import styled from 'styled-components';

const Container = styled.div<{
  inputCount: number;
  isLoading?: boolean;
  noMargin?: boolean;
}>`
  padding: ${({ inputCount }) => (inputCount ? '34px 20px 20px 20px' : '20px')};
  border: 1px solid rgba(60, 60, 100, 0.9);
  background: rgba(10, 10, 30, 0.9);
  border-radius: 5px;
  display: flex;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  ${({ noMargin }) => !noMargin && 'margin-bottom: 30px;'}
  flex-wrap: ${({ inputCount }) => (inputCount > 2 ? 'wrap' : 'nowrap')};
  @media (max-width: 1150px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    input {
      margin-bottom: 10px;
    }
  }
`;

interface Props {
  children: React.ReactNode;
  loading?: boolean;
  inputCount?: number;
}

export const ActionContainer: React.FC<Props> = ({
  children,
  loading = false,
  inputCount = 0,
}) => (
  <Container inputCount={inputCount} isLoading={loading}>
    {children}
  </Container>
);

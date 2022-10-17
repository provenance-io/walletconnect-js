import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  color: white;
  bottom: 10px;
  left: 10px;
  padding: 10px 20px;
  background: rgba(100, 150, 123, 0.8);
  border-radius: 5px;
  cursor: pointer;
`;

export const ExternalLink: React.FC = () => {
  return <Container>ExternalLink</Container>;
};

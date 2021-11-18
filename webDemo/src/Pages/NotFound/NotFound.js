import styled from 'styled-components';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20%;
`;

const Shrug = styled.p`
  margin: 0;
  font-size: 5rem;
`;

const Haiku = styled.p`
  font-size: 1.5rem;
  text-align: center;
`;

const Line = styled.span`
  display: block;
`;

export const NotFound = () => (
  <Wrapper>
    <Shrug>¯\_(ツ)_/¯</Shrug>
    <Haiku>
      <Line>We can&apos;t find what you</Line>
      <Line>are looking for, it is a</Line>
      <Line>classic case of 404</Line>
    </Haiku>
  </Wrapper>
);

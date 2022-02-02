import { useState } from 'react';
import styled from 'styled-components';
import { ALL_ACTIONS } from 'consts';
import {
  Action,
  Dropdown,
} from 'Components';

const Container = styled.div`
  padding: 20px;
`;
const Title = styled.p`
  font-weight: 700;
  font-family: 'Poppins',sans-serif;
  font-size: 1.6rem;
  line-height: 3.2rem;
  margin: 0 0 14px 0;
`;

export const MultiAction = ({ setResults }) => { // eslint-disable-line react/prop-types
  const [activeMethod, setActiveMethod] = useState(undefined);
  const dropdownOptions = ALL_ACTIONS.map(({ method }) => method).sort();
  
  const renderActions = () => ALL_ACTIONS.map(({ method, fields, windowMessage, json }) => (
    (activeMethod === method) ? (
      <Action
        key={method}
        method={method}
        setResults={setResults}
        fields={fields}
        windowMessage={windowMessage}
        json={json}
        multiAction
      />
    ) : null    
  ));

    return (
      <Container>
        <Title>Add an Action</Title>
        <Dropdown name="actions" options={dropdownOptions} onChange={setActiveMethod} value={activeMethod} />
        {activeMethod && (
          <>
            <Title>Action Details</Title>
            {renderActions()}
          </>
        )}
      </Container>
    )
};
import { Outlet } from 'react-router-dom';
import { Sidebar } from 'Components';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const RootContainer = styled.div`
  position: relative;
`;
const PageContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0 0 0;
  margin-left: 200px;
  @media screen and (max-width: 1080px) {
    padding: 40px;
  }
  @media screen and (max-width: 800px) {
    margin-left: 0;
  }
`;

export const Root: React.FC = () => {
  const [initialLoad, setInitialLoad] = useState(true);

  // This useEffect should only run once
  useEffect(() => {
    // One or more values within localStorage have changed, see if we care about any of the values and update the state as needed
    const handleLocalStorageChange = (storageEvent: StorageEvent) => {
      const { key: storageEventKey, newValue, oldValue } = storageEvent;
      // Make sure the key is changing a value we care about, must be walletconnect or walletconnect-js
      if (
        storageEventKey === 'walletconnect' ||
        storageEventKey === 'walletconnect-js'
      ) {
        const newValueObj = JSON.parse(newValue || '{}');
        const oldValueObj = JSON.parse(oldValue || '{}');
        // Compare changed values
        const allChangedValues = {} as any;
        const newValueKeys = Object.keys(newValueObj);
        // const oldValueKeys = Object.keys(oldValueObj);
        newValueKeys.forEach((key) => {
          if (newValueObj[key] !== oldValueObj[key]) {
            allChangedValues[key] = newValueObj[key];
          }
        });
        console.log(
          'LocalStorage Value Change Detected! Key: ',
          storageEventKey,
          'Changed: ',
          allChangedValues
        );
      }
    };

    if (initialLoad) {
      setInitialLoad(false);
      // Create event listener for localStorage changes
      window.addEventListener('storage', handleLocalStorageChange);
    }
  }, [initialLoad]);

  return (
    <RootContainer>
      <Sidebar />
      <PageContent>
        <Outlet />
      </PageContent>
    </RootContainer>
  );
};

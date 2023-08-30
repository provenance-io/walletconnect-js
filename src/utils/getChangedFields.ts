type StorageObject = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
type TargetKeyArray = string[];

// Determine which fields have changed between each object
export const getChangedFields = (
  newObj: StorageObject,
  oldObj: StorageObject,
  targetKeys: TargetKeyArray
) => {
  const changedValues: StorageObject = {};
  // We have a specific set of keys to look for differences with
  if (targetKeys) {
    targetKeys.forEach((key) => {
      // targetKeys will be in "dot" notation, eg: wallet.address, check for them and look for those keys accordingly (nested)
      // Note: We won't go deeper than 3 keys
      const [key0, key1, key2] = key.split('.');
      // Check the furthest out value first to build the changed shape
      if (key2) {
        const valueChanged = newObj[key0][key1][key2] !== oldObj[key0][key1][key2];
        if (valueChanged) {
          if (!changedValues[key0]) changedValues[key0] = {};
          if (!changedValues[key0][key1]) changedValues[key0][key1] = {};
          changedValues[key0][key1][key2] = newObj[key0][key1][key2];
        }
      } else if (key1) {
        const valueChanged = newObj[key0][key1] !== oldObj[key0][key1];
        if (valueChanged) {
          if (!changedValues[key0]) changedValues[key0] = {};
          changedValues[key0][key1] = newObj[key0][key1];
        }
      } else if (key0) {
        const valueChanged = newObj[key0] !== oldObj[key0];
        if (valueChanged) {
          changedValues[key0] = newObj[key0];
        }
      }
    });
  }

  return changedValues;
};

/*
  Where it's used:
    - When we compare the current saved state for an object to a new saved state for an object.
    - This will happen when one tab says "Switch active account". All the other tabs need to know that the currently selected/connected account has changed
    - DApps need to be able to detect this change as well incase they don't support the selected account from one tab to the next
  
  How will it work:
    - There will be an event listener looking for specific localStorage value changes
    - We will be interested in specific values changes like:
      - wallet.address, wallet.signedJWT, connection.walletAppId, connection.est, connection.ext, and connection.timeout
      - We will also look through some walletconnect values too
    - When we see these values changed, we will update our current state to match the new value
      - Some of these values will potentially change other state values
        - Eg: walletconnect.connected => connection.status
      - The dApp will have it's own listeners setup to detect when these changes take place
        - Eg: return wcs.state.connection.status === 'connected' ? 'Connected!' : 'Disconnected.'
        
  Concerns:
    - Now that we don't broadcast anything, can non-react dApps catch these context state value changes correctly?
      - They should since the state is shared in the context class, but needs testing in a non-react app
      - Not specific to this util function, more of a consideration of just removing broadcast functionality maybe
*/

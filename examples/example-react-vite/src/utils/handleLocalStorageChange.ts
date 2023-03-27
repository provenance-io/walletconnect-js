// One or more values within localStorage have changed, see if we care about any of the values and update the state as needed
export const handleLocalStorageChange = (storageEvent: StorageEvent) => {
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

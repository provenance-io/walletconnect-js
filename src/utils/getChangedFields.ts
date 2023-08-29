type StorageObject = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
type TargetKeyArray = string[];

// Determine which fields have changed between each object
export const getChangedFields = (
  newObj: StorageObject,
  oldObj: StorageObject,
  targetKeys: TargetKeyArray
) => {
  const changedValues: StorageObject = {};

  // ISSUE: This function will only work for the first key of an object, eg: food.fruit
  // It will not check food.fruit.apple
  // - Option 1: We need to recursively check every field if it's an object (maybe a max depth? Wc obj must be deep...)
  // -- Check each key until all "targetKeys" have been hit or there are no more objects to look over
  // - Option 2: allow 'targetKeys' value to include a '.' indicating we want to find a nested key value
  // -- Main usecase is wcs state which will now have all values nested once, eg: connection.connectionEST
  // -- This would prevent having to loop over and over and we could target the exact spot in the object

  // Recursive loop to check nested objects for their keys

  // We have a specific set of keys to look for differences with
  if (targetKeys) {
    targetKeys.forEach((key) => {
      // targetKeys might be in "dot" notation, eg: wallet.address, check for them and look for those keys accordingly (nested)
      // Note: We won't go deeper than 3 keys
      const [key0, key1, key3] = key.split('.');
      if (newObj[key0][key1][key3] !== oldObj[key0][key1][key3]) {
        // Issue: How do we handle building the changedValues object with nesting?

        if (key1 && !changedValues[key0][key1]) changedValues;
        changedValues[key0] = newObj[key];
      }
    });
  }

  return changedValues;
};

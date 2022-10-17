export const decodeJWT = (
  encodedJWT: string,
  validation: { [key: string]: string | number }
) => {
  // Our JWTs are made of three parts, separated by a '.' - [header].[payload].[signature]
  // To keep this function lean and simple, we won't validate the signature, we'll use an optional
  // validation object that will check for a specific value in the payload.

  const [encodedHeader, encodedPayload] = encodedJWT.split("."); // [header, payload, signature]
  const decodedHeader = atob(encodedHeader);
  const decodedPayload = atob(encodedPayload);
  const header = JSON.parse(decodedHeader);
  const payload = JSON.parse(decodedPayload);
  let valid = true;
  if (validation) {
    const validationKeys = Object.keys(validation);
    validationKeys.forEach((key) => {
      const validationValue = validation[key];
      const payloadValue = payload[key];
      if (validationValue !== payloadValue) valid = false;
    });
  }

  return {
    header,
    payload,
    valid,
  };
};

// Mobile wallets have a dynamic url for creating their full urls.  This url, when clicked on by a mobile device, will prompt the phones browser to open their existing wallet app or direct them to the app store to download it.  Moved this function into a util in order to write unit tests around it.
interface GenerateDyanmicUrl {
  qRCodeUrl: string;
  originUrl: string;
  walletConnectUrl: string;
  packageName: string;
  appId: string;
  efr?: string;
}

export const generateDynamicUrl = ({
  qRCodeUrl,
  originUrl,
  walletConnectUrl,
  packageName,
  appId,
  efr = '1',
}: GenerateDyanmicUrl) => {
  const doubleEncode = (value: string) =>
    encodeURIComponent(encodeURIComponent(value));
  // Note: We need to double encode each url param (refer to mobile team)
  const linkParam = doubleEncode(`${walletConnectUrl}?data=${qRCodeUrl}`);
  const apnParam = doubleEncode(packageName);
  const ibiParam = doubleEncode(packageName);
  const isiParam = doubleEncode(appId);
  const efrParam = doubleEncode(efr);
  const fullUrlParamsEncoded = `?link=${linkParam}&apn=${apnParam}&ibi=${ibiParam}&isi=${isiParam}&efr=${efrParam}`;
  const fullUrl = `${originUrl}${fullUrlParamsEncoded}`;

  return fullUrl;
};

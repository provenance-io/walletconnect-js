interface GenerateDyanmicUrl {
  qRCodeUrl: string;
  originUrl: string;
  walletConnectUrl: string;
  packageName: string;
  appId: string;
  efr?: string;
}

// Mobile wallets have a dynamic url for creating their full urls.  This url, when clicked on by a mobile device, will prompt the phones browser to open their existing wallet app or direct them to the app store to download it.  Moved this function into a util in order to write unit tests around it.
// Ref: https://www.notion.so/figuretech/Deep-Linking-25b15c3483f24d68b5ddb4cd2ff6f8fb
export const generateDynamicUrl = ({
  qRCodeUrl,
  originUrl,
  walletConnectUrl,
  packageName,
  appId,
  efr = '1',
}: GenerateDyanmicUrl) => {
  const linkParam = encodeURIComponent(
    `${walletConnectUrl}?data=${encodeURIComponent(qRCodeUrl)}`
  );
  const apnParam = packageName;
  const ibiParam = packageName;
  const isiParam = appId;
  const efrParam = efr;
  const fullUrlParamsEncoded = `?link=${linkParam}&apn=${apnParam}&ibi=${ibiParam}&isi=${isiParam}&efr=${efrParam}`;
  const fullUrl = `${originUrl}${fullUrlParamsEncoded}`;

  return fullUrl;
};

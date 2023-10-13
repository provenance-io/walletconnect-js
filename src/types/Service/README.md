# Method vs Function (Naming)
  - Each class method will have a Browser and WalletConnect (WC) version of the internal function due to difference in messaging structures
  - Each WalletConnectService (WCS) method needs the same response to WalletConnectService and to the dApp, no matter the function used (Browser vs WC)
  - Each WCS method needs to take in the same params for Browser vs WC messaging (dApp shouldn't know nor care which is being used)
## Method
  - Part of WCS class, called directly by dApps
## Function
  - Abstracted function code outside of WCS class, used by the method functions internally
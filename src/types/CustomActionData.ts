export type CustomActionData = {
  message: string | string[],
  description: string,
  method: string
  gasPrice?: { gasPrice: number, gasPriceDenom: string }
}
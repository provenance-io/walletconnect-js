export type SendCoinData = {
  to: string,
  amount: number,
  denom: string,
  gasPrice?: { gasPrice: number, gasPriceDenom: string }
}

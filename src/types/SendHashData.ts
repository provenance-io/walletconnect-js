import { GasPrice } from './GasPriceType'

interface Amount {
  amount: number
  gasPrice?: GasPrice,
}

interface DelegateHashData extends Amount {
  validatorAddress: string,
  to: never
}
interface SendData extends Amount {
  to: string,
  validatorAddress: never
}

export type SendHashData = DelegateHashData | SendData

export type SendHashBatchData = (DelegateHashData | SendData) & {
  count: number
}
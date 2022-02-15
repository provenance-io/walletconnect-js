interface Amount {
  amount: number
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
// @flow
import axios from 'axios'

import { getTxServiceHost, getTxServiceUriFrom } from '~/config'
import { getWeb3 } from '~/logic/wallets/getWeb3'

export type Operation = 0 | 1 | 2

const calculateBodyFrom = async (
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: string | number,
  safeTxGas: string | number,
  baseGas: string | number,
  gasPrice: string | number,
  gasToken: string,
  refundReceiver: string,
  transactionHash: string | null,
  sender: string,
  origin: string | null,
  signature: ?string,
) => {
  const contractTransactionHash = await safeInstance.getTransactionHash(
    to,
    valueInWei,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce,
  )

  return {
    to: getWeb3().utils.toChecksumAddress(to),
    value: valueInWei,
    data,
    operation,
    nonce,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    contractTransactionHash,
    transactionHash,
    sender: getWeb3().utils.toChecksumAddress(sender),
    origin,
    signature,
  }
}

export const buildTxServiceUrl = (safeAddress: string) => {
  const host = getTxServiceHost()
  const address = getWeb3().utils.toChecksumAddress(safeAddress)
  const base = getTxServiceUriFrom(address)
  return `${host}${base}?has_confirmations=True`
}

const SUCCESS_STATUS = 201 // CREATED status

export const saveTxToHistory = async ({
  baseGas,
  data,
  gasPrice,
  gasToken,
  nonce,
  operation,
  origin,
  refundReceiver,
  safeInstance,
  safeTxGas,
  sender,
  signature,
  to,
  txHash,
  valueInWei,
}: {
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: number | string,
  safeTxGas: string | number,
  baseGas: string | number,
  gasPrice: string | number,
  gasToken: string,
  refundReceiver: string,
  txHash: string | null,
  sender: string,
  origin: string | null,
  signature: ?string,
}) => {
  const url = buildTxServiceUrl(safeInstance.address)
  const body = await calculateBodyFrom(
    safeInstance,
    to,
    valueInWei,
    data,
    operation,
    nonce,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    txHash || null,
    sender,
    origin || null,
    signature,
  )
  const response = await axios.post(url, body)

  if (response.status !== SUCCESS_STATUS) {
    return Promise.reject(new Error('Error submitting the transaction'))
  }

  return Promise.resolve()
}

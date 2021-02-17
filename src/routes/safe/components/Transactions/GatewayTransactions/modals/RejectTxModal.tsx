import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from './style'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'

import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFees } from 'src/components/TransactionsFees'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ParametersStatus } from 'src/routes/safe/components/Transactions/helpers/utils'

const useStyles = makeStyles(styles)

type Props = {
  isOpen: boolean
  onClose: () => void
  gwTransaction: Transaction
}

export const RejectTxModal = ({ isOpen, onClose, gwTransaction }: Props): React.ReactElement => {
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const classes = useStyles()

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
    gasLimit,
    gasEstimation,
    gasPriceFormatted,
  } = useEstimateTransactionGas({
    txData: EMPTY_DATA,
    txRecipient: safeAddress,
  })

  const origin = gwTransaction.safeAppInfo
    ? JSON.stringify({ name: gwTransaction.safeAppInfo.name, url: gwTransaction.safeAppInfo.url })
    : ''

  const nonce = gwTransaction.executionInfo?.nonce ?? 0

  const sendReplacementTransaction = (txParameters: TxParameters) => {
    dispatch(
      createTransaction({
        safeAddress,
        to: safeAddress,
        valueInWei: '0',
        txNonce: nonce,
        origin,
        safeTxGas: txParameters.safeTxGas ? Number(txParameters.safeTxGas) : undefined,
        ethParameters: txParameters,
        notifiedTransaction: TX_NOTIFICATION_TYPES.CANCELLATION_TX,
        navigateToTransactionsTab: false,
      }),
    )
    onClose()
  }

  const getParametersStatus = (): ParametersStatus => {
    return 'CANCEL_TRANSACTION'
  }

  return (
    <Modal description="Reject Transaction" handleClose={onClose} open={isOpen} title="Reject Transaction">
      <EditableTxParameters
        ethGasLimit={gasLimit}
        ethGasPrice={gasPriceFormatted}
        safeTxGas={gasEstimation.toString()}
        safeNonce={nonce.toString()}
        parametersStatus={getParametersStatus()}
      >
        {(txParameters, toggleEditMode) => {
          return (
            <>
              <Row align="center" className={classes.heading} grow>
                <Paragraph className={classes.headingText} noMargin weight="bolder">
                  Reject transaction
                </Paragraph>
                <IconButton disableRipple onClick={onClose}>
                  <Close className={classes.closeIcon} />
                </IconButton>
              </Row>
              <Hairline />
              <Block className={classes.container}>
                <Row>
                  <Paragraph>
                    This action will cancel this transaction. A separate transaction will be performed to submit the
                    rejection.
                  </Paragraph>
                  <Paragraph color="medium" size="sm">
                    Transaction nonce:
                    <br />
                    <Bold className={classes.nonceNumber}>{nonce}</Bold>
                  </Paragraph>
                </Row>
                {/* Tx Parameters */}
                <TxParametersDetail
                  txParameters={txParameters}
                  onEdit={toggleEditMode}
                  parametersStatus={getParametersStatus()}
                  isTransactionCreation={isCreation}
                  isTransactionExecution={isExecution}
                />
              </Block>

              {txEstimationExecutionStatus === EstimationStatus.LOADING ? null : (
                <Block className={classes.gasCostsContainer}>
                  <TransactionFees
                    gasCostFormatted={gasCostFormatted}
                    isExecution={isExecution}
                    isCreation={isCreation}
                    isOffChainSignature={isOffChainSignature}
                    txEstimationExecutionStatus={txEstimationExecutionStatus}
                  />
                </Block>
              )}
              <Row align="center" className={classes.buttonRow}>
                <Button minHeight={42} minWidth={140} onClick={onClose}>
                  Exit
                </Button>
                <Button
                  color="secondary"
                  minHeight={42}
                  minWidth={214}
                  onClick={() => sendReplacementTransaction(txParameters)}
                  type="submit"
                  variant="contained"
                  disabled={txEstimationExecutionStatus === EstimationStatus.LOADING}
                >
                  Reject Transaction
                </Button>
              </Row>
            </>
          )
        }}
      </EditableTxParameters>
    </Modal>
  )
}

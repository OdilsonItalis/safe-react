// @flow
import React, { useEffect, useState } from 'react'
import { BigNumber } from 'bignumber.js'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { withSnackbar } from 'notistack'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Img from '~/components/layout/Img'
import Block from '~/components/layout/Block'
import EtherscanBtn from '~/components/EtherscanBtn'
import CopyBtn from '~/components/CopyBtn'
import Identicon from '~/components/Identicon'
import Hairline from '~/components/layout/Hairline'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'
import { getStandardTokenContract, getHumanFriendlyToken } from '~/logic/tokens/store/actions/fetchTokens'
import { estimateTxGasCosts } from '~/logic/safe/transactions/gasNew'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { isEther } from '~/logic/tokens/utils/tokenHelpers'
import ArrowDown from '../assets/arrow-down.svg'
import { styles } from './style'

type Props = {
  onClose: () => void,
  setActiveScreen: Function,
  classes: Object,
  safeAddress: string,
  safeName: string,
  ethBalance: string,
  tx: Object,
  createTransaction: Function,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const ReviewTx = ({
  onClose,
  setActiveScreen,
  classes,
  safeAddress,
  safeName,
  ethBalance,
  tx,
  createTransaction,
  enqueueSnackbar,
  closeSnackbar,
}: Props) => {
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')
  const isSendingETH = isEther(tx.token.symbol)
  const txRecipient = isSendingETH ? tx.recipientAddress : tx.token.address

  useEffect(() => {
    let isCurrent = true
    const estimateGas = async () => {
      const web3 = getWeb3()
      const { fromWei, toBN } = web3.utils
      let txData = EMPTY_DATA

      if (!isSendingETH) {
        const StandardToken = await getStandardTokenContract()
        const tokenInstance = await StandardToken.at(tx.token.address)

        txData = tokenInstance.contract.methods.transfer(tx.recipientAddress, 0).encodeABI()
      }

      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, txRecipient, txData)
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)
      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [])

  const submitTx = async () => {
    const web3 = getWeb3()
    let txData = EMPTY_DATA
    let txAmount = web3.utils.toWei(tx.amount, 'ether')

    if (!isSendingETH) {
      const StandardToken = await getStandardTokenContract()
      const HumanFriendlyToken = await getHumanFriendlyToken()
      const tokenInstance = await StandardToken.at(tx.token.address)
      const hfTokenInstance = await HumanFriendlyToken.at(tx.token.address)
      const decimals = await hfTokenInstance.decimals()
      txAmount = new BigNumber(tx.amount).times(10 ** decimals.toNumber()).toString()

      txData = tokenInstance.contract.methods.transfer(tx.recipientAddress, txAmount).encodeABI()
      // txAmount should be 0 if we send tokens
      // the real value is encoded in txData and will be used by the contract
      // if txAmount > 0 it would send ETH from the Safe
      txAmount = 0
    }

    createTransaction(
      safeAddress,
      txRecipient,
      txAmount,
      txData,
      TX_NOTIFICATION_TYPES.STANDARD_TX,
      enqueueSnackbar,
      closeSnackbar,
    )
    onClose()
  }

  return (
    <>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.headingText} noMargin>
          Send Funds
        </Paragraph>
        <Paragraph className={classes.annotation}>2 of 2</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <SafeInfo safeAddress={safeAddress} safeName={safeName} ethBalance={ethBalance} />
        <Row margin="md">
          <Col xs={1}>
            <img src={ArrowDown} alt="Arrow Down" style={{ marginLeft: '8px' }} />
          </Col>
          <Col xs={11} center="xs" layout="column">
            <Hairline />
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph size="md" color="disabled" style={{ letterSpacing: '-0.5px' }} noMargin>
            Recipient
          </Paragraph>
        </Row>
        <Row margin="md" align="center">
          <Col xs={1}>
            <Identicon address={tx.recipientAddress} diameter={32} />
          </Col>
          <Col xs={11} layout="column">
            <Block justify="left">
              <Paragraph weight="bolder" className={classes.address} noMargin>
                {tx.recipientAddress}
              </Paragraph>
              <CopyBtn content={tx.recipientAddress} />
              <EtherscanBtn type="address" value={tx.recipientAddress} />
            </Block>
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph size="md" color="disabled" style={{ letterSpacing: '-0.5px' }} noMargin>
            Amount
          </Paragraph>
        </Row>
        <Row margin="md" align="center">
          <Img src={tx.token.logoUri} height={28} alt={tx.token.name} onError={setImageToPlaceholder} />
          <Paragraph size="md" noMargin className={classes.amount}>
            {tx.amount}
            {' '}
            {tx.token.symbol}
          </Paragraph>
        </Row>
        <Row>
          <Paragraph>
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
          </Paragraph>
        </Row>
      </Block>
      <Hairline style={{ position: 'absolute', bottom: 85 }} />
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} onClick={() => setActiveScreen('sendFunds')}>
          Back
        </Button>
        <Button
          type="submit"
          onClick={submitTx}
          variant="contained"
          minWidth={140}
          color="primary"
          data-testid="submit-tx-btn"
          className={classes.submitButton}
        >
          Submit
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles)(withSnackbar(ReviewTx))

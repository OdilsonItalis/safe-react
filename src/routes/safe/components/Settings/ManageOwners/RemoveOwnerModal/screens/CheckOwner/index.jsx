// @flow
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames/bind'
import React from 'react'

import { styles } from './style'

import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'

export const REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID = 'remove-owner-next-btn'

type Props = {
  onClose: () => void,
  classes: Object,
  ownerAddress: string,
  ownerName: string,
  onSubmit: Function,
}

const CheckOwner = ({ classes, onClose, onSubmit, ownerAddress, ownerName }: Props) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Remove owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 3</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
        <Row margin="md">
          <Paragraph>Review the owner you want to remove from the active Safe:</Paragraph>
        </Row>
        <Row className={classes.owner}>
          <Col align="center" xs={1}>
            <Identicon address={ownerAddress} diameter={32} />
          </Col>
          <Col xs={7}>
            <Block className={classNames(classes.name, classes.userName)}>
              <Paragraph noMargin size="lg" weight="bolder">
                {ownerName}
              </Paragraph>
              <Block className={classes.user} justify="center">
                <Paragraph className={classes.address} color="disabled" noMargin size="md">
                  {ownerAddress}
                </Paragraph>
                <CopyBtn content={ownerAddress} />
                <EtherscanBtn type="address" value={ownerAddress} />
              </Block>
            </Block>
          </Col>
        </Row>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button minHeight={42} minWidth={140} onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          minHeight={42}
          minWidth={140}
          onClick={handleSubmit}
          testId={REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID}
          type="submit"
          variant="contained"
        >
          Next
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles)(CheckOwner)

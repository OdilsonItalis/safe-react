// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ArrowDropDown'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Identicon from '~/components/Identicon'
import Spacer from '~/components/Spacer'
import Details from './Details'

const logo = require('../assets/gnosis-safe-logo.svg')

type Props = {
  provider: string,
  classes: Object,
  network: string,
  userAddress: string,
  connected: boolean,
}

const styles = theme => ({
  root: {
    width: '100%',
  },
  summary: {
    backgroundColor: '#f1f1f1',
    border: 'solid 0.5px #979797',
  },
  logo: {
    flexBasis: '125px',
  },
  provider: {
    flexBasis: '130px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  user: {
    alignItems: 'center',
    border: '1px solid grey',
    padding: '10px',
    backgroundColor: '#f1f1f1',
  },
  address: {
    flexGrow: 1,
    textAlign: 'center',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
    width: '375px',
    border: '1px solid grey',
    display: 'block',
    padding: '12px 8px 4px',
    margin: '0 0 16px auto',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

const openIconStyle = {
  height: '14px',
}

const Header = ({
  provider, network, connected, classes, userAddress,
}: Props) => {
  const providerText = connected ? `${provider} [${network}]` : 'Not connected'
  const cutAddress = connected ? `${userAddress.substring(0, 8)}...${userAddress.substring(36)}` : ''

  return (
    <Block margin="md">
      <ExpansionPanel className={classes.root} elevation={0}>
        <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
          <Row grow>
            <Col start="xs" middle="xs" className={classes.logo}>
              <Img src={logo} height={54} alt="Gnosis Safe" />
            </Col>
            <Spacer />
            <Col end="sm" middle="xs" layout="column" className={classes.provider}>
              <Paragraph size="sm" transform="capitalize" noMargin bold>{providerText}</Paragraph>
              <Paragraph size="sm" noMargin>{cutAddress}</Paragraph>
            </Col>
          </Row>
        </ExpansionPanelSummary>
        { connected &&
          <React.Fragment>
            <ExpansionPanelDetails className={classes.details}>
              <Row grow margin="md">
                <Details provider={provider} connected={connected} network={network} />
                <Spacer />
              </Row>
              <Row className={classes.user} margin="md" grow >
                <Identicon address={userAddress} diameter={25} />
                <Paragraph className={classes.address} size="sm" noMargin>{userAddress}</Paragraph>
                <OpenInNew style={openIconStyle} />
              </Row>
              <Col align="center" margin="md">
                <Button size="small" variant="raised" color="secondary">DISCONNECT</Button>
              </Col>
            </ExpansionPanelDetails>
          </React.Fragment>
        }
      </ExpansionPanel>
    </Block>
  )
}

export default withStyles(styles)(Header)

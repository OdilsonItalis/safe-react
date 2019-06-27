// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Table from '~/components/Table'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import Img from '~/components/layout/Img'
import AddOwnerModal from './AddOwnerModal'
import RemoveOwnerModal from './RemoveOwnerModal'
import ReplaceOwnerModal from './ReplaceOwnerModal'
import EditOwnerModal from './EditOwnerModal'
import OwnerAddressTableCell from './OwnerAddressTableCell'
import type { Owner } from '~/routes/safe/store/models/owner'
import {
  getOwnerData, generateColumns, OWNERS_TABLE_ADDRESS_ID, type OwnerRow,
} from './dataFetcher'
import { sm, boldFont } from '~/theme/variables'
import { styles } from './style'
import ReplaceOwnerIcon from './assets/icons/replace-owner.svg'
import RenameOwnerIcon from './assets/icons/rename-owner.svg'
import RemoveOwnerIcon from '../assets/icons/bin.svg'

const controlsStyle = {
  backgroundColor: 'white',
  padding: sm,
}

const addOwnerButtonStyle = {
  marginRight: sm,
  fontWeight: boldFont,
}

type Props = {
  classes: Object,
  safeAddress: string,
  safeName: string,
  owners: List<Owner>,
  network: string,
  threshold: number,
  userAddress: string,
  createTransaction: Function,
  updateSafe: Function,
}

type State = {
  selectedOwnerAddress?: string,
  selectedOwnerName?: string,
  showAddOwner: boolean,
  showRemoveOwner: boolean,
  showReplaceOwner: boolean,
  showEditOwner: boolean,
}

type Action = 'AddOwner' | 'EditOwner' | 'ReplaceOwner' | 'RemoveOwner'

class ManageOwners extends React.Component<Props, State> {
  state = {
    selectedOwnerAddress: undefined,
    selectedOwnerName: undefined,
    showAddOwner: false,
    showRemoveOwner: false,
    showReplaceOwner: false,
    showEditOwner: false,
  }

  onShow = (action: Action, row?: Object) => () => {
    this.setState({
      [`show${action}`]: true,
      selectedOwnerAddress: row && row.address,
      selectedOwnerName: row && row.name,
    })
  }

  onHide = (action: Action) => () => {
    this.setState({
      [`show${action}`]: false,
      selectedOwnerAddress: undefined,
      selectedOwnerName: undefined,
    })
  }

  render() {
    const {
      classes,
      safeAddress,
      safeName,
      owners,
      threshold,
      network,
      userAddress,
      createTransaction,
      updateSafe,
    } = this.props
    const {
      showAddOwner,
      showRemoveOwner,
      showReplaceOwner,
      showEditOwner,
      selectedOwnerName,
      selectedOwnerAddress,
    } = this.state

    const columns = generateColumns()
    const autoColumns = columns.filter(c => !c.custom)
    const ownerData = getOwnerData(owners)

    return (
      <React.Fragment>
        <Block className={classes.formContainer}>
          <Paragraph noMargin className={classes.title} size="lg" weight="bolder">
            Manage Safe Owners
          </Paragraph>
          <Table label="owners" columns={columns} data={ownerData} size={ownerData.size} defaultFixed noBorder>
            {(sortedData: Array<OwnerRow>) => sortedData.map((row: any, index: number) => (
              <TableRow tabIndex={-1} key={index} className={classes.hide}>
                {autoColumns.map((column: Column) => (
                  <TableCell key={column.id} style={cellWidth(column.width)} align={column.align} component="td">
                    {column.id === OWNERS_TABLE_ADDRESS_ID ? (
                      <OwnerAddressTableCell address={row[column.id]} />
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
                <TableCell component="td">
                  <Row align="end" className={classes.actions}>
                    <Img
                      alt="Edit owner"
                      className={classes.editOwnerIcon}
                      src={RenameOwnerIcon}
                      onClick={this.onShow('EditOwner', row)}
                    />
                    <Img
                      alt="Replace owner"
                      className={classes.replaceOwnerIcon}
                      src={ReplaceOwnerIcon}
                      onClick={this.onShow('ReplaceOwner', row)}
                    />
                    <Img
                      alt="Remove owner"
                      className={classes.removeOwnerIcon}
                      src={RemoveOwnerIcon}
                      onClick={this.onShow('RemoveOwner', row)}
                    />
                  </Row>
                </TableCell>
              </TableRow>
            ))
            }
          </Table>
        </Block>
        <Hairline />
        <Row style={controlsStyle} align="end" grow>
          <Col end="xs">
            <Button
              style={addOwnerButtonStyle}
              size="small"
              variant="contained"
              color="primary"
              onClick={this.onShow('AddOwner')}
            >
              Add new owner
            </Button>
          </Col>
        </Row>
        <AddOwnerModal
          onClose={this.onHide('AddOwner')}
          isOpen={showAddOwner}
          safeAddress={safeAddress}
          safeName={safeName}
          owners={owners}
          threshold={threshold}
          network={network}
          userAddress={userAddress}
          createTransaction={createTransaction}
        />
        <RemoveOwnerModal
          onClose={this.onHide('RemoveOwner')}
          isOpen={showRemoveOwner}
          safeAddress={safeAddress}
          safeName={safeName}
          ownerAddress={selectedOwnerAddress}
          ownerName={selectedOwnerName}
          owners={owners}
          threshold={threshold}
          network={network}
          userAddress={userAddress}
          createTransaction={createTransaction}
        />
        <ReplaceOwnerModal
          onClose={this.onHide('ReplaceOwner')}
          isOpen={showReplaceOwner}
          safeAddress={safeAddress}
          safeName={safeName}
          ownerAddress={selectedOwnerAddress}
          ownerName={selectedOwnerName}
          owners={owners}
          network={network}
          threshold={threshold}
          userAddress={userAddress}
          createTransaction={createTransaction}
          updateSafe={updateSafe}
        />
        <EditOwnerModal
          onClose={this.onHide('EditOwner')}
          isOpen={showEditOwner}
          safeAddress={safeAddress}
          ownerAddress={selectedOwnerAddress}
          selectedOwnerName={selectedOwnerName}
          owners={owners}
          network={network}
          updateSafe={updateSafe}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(ManageOwners)

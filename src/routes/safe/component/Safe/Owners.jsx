// @flow
import * as React from 'react'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import { withStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import ListItemText from '~/components/List/ListItemText'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Button from '~/components/layout/Button'
import Group from '@material-ui/icons/Group'
import Delete from '@material-ui/icons/Delete'
import Person from '@material-ui/icons/Person'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { type OwnerProps } from '~/routes/safe/store/model/owner'
import { type WithStyles } from '~/theme/mui'
import { sameAddress } from '~/wallets/ethAddresses'

const styles = {
  nested: {
    paddingLeft: '40px',
  },
}

type Props = Open & WithStyles & {
  owners: List<OwnerProps>,
  userAddress: string,
  onAddOwner: () => void,
}

export const ADD_OWNER_BUTTON_TEXT = 'Add'
export const REMOVE_OWNER_BUTTON_TEXT = 'Delete'

const Owners = openHoc(({
  open, toggle, owners, classes, onAddOwner, userAddress,
}: Props) => (
  <React.Fragment>
    <ListItem onClick={toggle}>
      <Avatar>
        <Group />
      </Avatar>
      <ListItemText primary="Owners" secondary={`${owners.size} owners`} />
      <ListItemIcon>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemIcon>
      <Button
        variant="raised"
        color="primary"
        onClick={onAddOwner}
      >
        {ADD_OWNER_BUTTON_TEXT}
      </Button>
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {owners.map(owner => (
          <ListItem key={owner.address} className={classes.nested}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText
              cut
              primary={owner.name}
              secondary={owner.address}
            />
            { !sameAddress(userAddress, owner.address) &&
              <IconButton aria-label="Delete">
                <Delete />
              </IconButton>
            }
          </ListItem>
        ))}
      </List>
    </Collapse>
  </React.Fragment>
))

export default withStyles(styles)(Owners)

// @flow
import { List } from 'immutable'
import * as React from 'react'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import Table, {
  TableBody, TableCell, TableHead, TableRow,
} from '~/components/layout/Table'
import { type Safe } from '~/routes/safe/store/models/safe'
import { SAFELIST_ADDRESS } from '~/routes/routes'

type Props = {
  safes: List<Safe>
}
const SafeTable = ({ safes }: Props) => (
  <Table size={900}>
    <TableHead>
      <TableRow>
        <TableCell>Open</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Deployed Address</TableCell>
        <TableCell align="right">Confirmations</TableCell>
        <TableCell align="right">Number of owners</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {safes.map(safe => (
        <TableRow key={safe.address}>
          <TableCell>
            <Link to={`${SAFELIST_ADDRESS}/${safe.address}`}>
              <Button variant="contained" size="small" color="primary">Open</Button>
            </Link>
          </TableCell>
          <TableCell padding="none">{safe.get('name')}</TableCell>
          <TableCell padding="none">{safe.get('address')}</TableCell>
          <TableCell padding="none" align="right">{safe.get('threshold')}</TableCell>
          <TableCell padding="none" align="right">{safe.get('owners').count()}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export default SafeTable

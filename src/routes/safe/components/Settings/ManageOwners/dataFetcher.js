// @flow
import { List } from 'immutable'
import type { Owner } from '~/routes/safe/store/models/owner'
import { type SortRow } from '~/components/Table/sorting'
import { type Column } from '~/components/Table/TableHead'

export const OWNERS_TABLE_NAME_ID = 'name'
export const OWNERS_TABLE_ADDRESS_ID = 'address'
export const OWNERS_TABLE_ACTIONS_ID = 'actions'

type OwnerData = {
  name: string,
  address: string,
}

export type OwnerRow = SortRow<OwnerData>

export const getOwnerData = (owners: List<Owner>): List<OwnerRow> => {
  const rows = owners.map((owner: Owner) => ({
    [OWNERS_TABLE_NAME_ID]: owner.get('name'),
    [OWNERS_TABLE_ADDRESS_ID]: owner.get('address'),
  }))

  return rows
}

export const generateColumns = () => {
  const nameColumn: Column = {
    id: OWNERS_TABLE_NAME_ID,
    order: false,
    disablePadding: false,
    label: 'Name',
    width: 150,
    align: 'left',
  }

  const addressColumn: Column = {
    id: OWNERS_TABLE_ADDRESS_ID,
    order: false,
    disablePadding: false,
    label: 'Address',
    width: 350,
    align: 'left',
  }

  const actionsColumn: Column = {
    id: OWNERS_TABLE_ACTIONS_ID,
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
  }

  return List([nameColumn, addressColumn, actionsColumn])
}

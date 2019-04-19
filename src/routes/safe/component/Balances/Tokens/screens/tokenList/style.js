// @flow
import {
  md, sm, xs, mediumFontSize, border,
} from '~/theme/variables'

export const styles = () => ({
  root: {
    minHeight: '48px',
  },
  search: {
    color: '#a2a8ba',
    paddingLeft: sm,
  },
  padding: {
    padding: `0 ${md}`,
  },
  add: {
    fontWeight: 'normal',
    paddingRight: md,
    paddingLeft: md,
  },
  list: {
    overflow: 'hidden',
    overflowY: 'scroll',
    padding: 0,
    height: '100%',
  },
  token: {
    minHeight: '50px',
    borderBottom: `1px solid ${border}`,
  },
  searchInput: {
    backgroundColor: 'transparent',
    lineHeight: 'initial',
    fontSize: mediumFontSize,
    padding: 0,
    '& > input::placeholder': {
      letterSpacing: '-0.5px',
      fontSize: mediumFontSize,
      color: 'black',
    },
    '& > input': {
      letterSpacing: '-0.5px',
    },
  },
  searchContainer: {
    width: '180px',
    marginLeft: xs,
    marginRight: xs,
  },
  searchRoot: {
    letterSpacing: '-0.5px',
    fontFamily: 'Roboto Mono, monospace',
    fontSize: mediumFontSize,
    border: 'none',
    boxShadow: 'none',
  },
  searchIcon: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
})

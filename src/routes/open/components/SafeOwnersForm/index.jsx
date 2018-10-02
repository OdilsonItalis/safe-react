// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required, composeValidators, uniqueAddress, mustBeEthereumAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import InputAdornment from '@material-ui/core/InputAdornment'
import CheckCircle from '@material-ui/icons/CheckCircle'
import { getOwnerNameBy, getOwnerAddressBy } from '~/routes/open/components/fields'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Hairline from '~/components/layout/Hairline'
import { md, lg, sm } from '~/theme/variables'

type Props = {
  classes: Object,
  otherAccounts: string[],
  errors: Object,
}

type State = {
  numOwners: number,
}

const styles = () => ({
  root: {
    display: 'flex',
  },
  title: {
    padding: `${md} ${lg}`,
  },
  owner: {
    padding: `${sm} ${lg}`,
  },
  name: {
    marginRight: `${sm}`,
  },
  trash: {
    top: '5px',
  },
  add: {
    justifyContent: 'center',
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
})

const getAddressValidators = (addresses: string[], position: number) => {
  const copy = addresses.slice()
  copy.splice(position, 1)

  return composeValidators(required, mustBeEthereumAddress, uniqueAddress(copy))
}

const noErrorsOn = (name: string, errors: Object) => errors[name] === undefined

class SafeOwners extends React.Component<Props, State> {
  state = {
    numOwners: 3,
  }

  render() {
    const { classes, errors, otherAccounts } = this.props
    const { numOwners } = this.state

    return (
      <React.Fragment>
        <Block className={classes.title}>
          <Paragraph noMargin size="md" color="primary" weight="light">
            Specify the owners of the Safe.
          </Paragraph>
        </Block>
        <Hairline />
        <Row className={classes.owner}>
          <Col xs={4}>
            NAME
          </Col>
          <Col xs={8}>
            ADDRESS
          </Col>
        </Row>
        <Hairline />
        { [...Array(Number(numOwners))].map((x, index) => {
          const addressName = getOwnerAddressBy(index)

          return (
            <Row key={`owner${(index)}`} className={classes.owner}>
              <Col xs={4}>
                <Field
                  className={classes.name}
                  name={getOwnerNameBy(index)}
                  component={TextField}
                  type="text"
                  validate={required}
                  placeholder="Owner Name*"
                  text="Owner Name"
                />
              </Col>
              <Col xs={7}>
                <Field
                  name={addressName}
                  component={TextField}
                  inputAdornment={noErrorsOn(addressName, errors) && {
                    endAdornment: (
                      <InputAdornment position="end">
                        <CheckCircle className={classes.check} />
                      </InputAdornment>
                    ),
                  }}
                  type="text"
                  validate={getAddressValidators(otherAccounts, index)}
                  placeholder="Owner Address*"
                  text="Owner Address"
                />
              </Col>
              <Col xs={1} center="xs" middle="xs">
                { index > 0 &&
                  <IconButton aria-label="Delete" onClick={undefined} className={classes.trash}>
                    <Delete />
                  </IconButton>
                }
              </Col>
            </Row>
          )
        }) }
        <Row align="center" grow className={classes.add} margin="xl">
          <Button color="secondary">
            + ADD ANOTHER OWNER
          </Button>
        </Row>
      </React.Fragment>
    )
  }
}

const SafeOwnersForm = withStyles(styles)(SafeOwners)

const SafeOwnersPage = () => (controls: React$Node, moe: Object) => {
  const { values, errors } = moe

  return (
    <React.Fragment>
      <OpenPaper controls={controls} padding={false}>
        <SafeOwnersForm otherAccounts={getAccountsFrom(values)} errors={errors} />
      </OpenPaper>
    </React.Fragment>
  )
}

export default SafeOwnersPage

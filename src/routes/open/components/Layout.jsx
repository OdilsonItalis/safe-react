// @flow
import * as React from 'react'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import IconButton from '@material-ui/core/IconButton'
import Stepper from '~/components/Stepper'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import Review from '~/routes/open/components/ReviewInformation'
import SafeNameField from '~/routes/open/components/SafeNameForm'
import SafeOwnersFields from '~/routes/open/components/SafeOwnersConfirmationsForm'
import { getOwnerNameBy, getOwnerAddressBy, FIELD_CONFIRMATIONS } from '~/routes/open/components/fields'
import { history } from '~/store'
import { secondary } from '~/theme/variables'

const getSteps = () => ['Start', 'Owners and confirmations', 'Review']

const initialValuesFrom = (userAccount: string) => ({
  [getOwnerNameBy(0)]: 'My Metamask (me)',
  [getOwnerAddressBy(0)]: userAccount,
  [FIELD_CONFIRMATIONS]: '1',
})

type Props = {
  provider: string,
  userAccount: string,
  network: string,
  onCallSafeContractSubmit: (values: Object) => Promise<void>,
}

const iconStyle = {
  color: secondary,
  padding: '8px',
  marginRight: '5px',
}

const back = () => {
  history.goBack()
}

const Layout = ({
  provider, userAccount, onCallSafeContractSubmit, network,
}: Props) => {
  const steps = getSteps()
  const initialValues = initialValuesFrom(userAccount)

  return (
    <React.Fragment>
      {provider ? (
        <Block>
          <Row align="center">
            <IconButton onClick={back} style={iconStyle} disableRipple>
              <ChevronLeft />
            </IconButton>
            <Heading tag="h2">Create New Safe</Heading>
          </Row>
          <Stepper
            onSubmit={onCallSafeContractSubmit}
            steps={steps}
            initialValues={initialValues}
            testId="create-safe-form"
          >
            <Stepper.Page>{SafeNameField}</Stepper.Page>
            <Stepper.Page>{SafeOwnersFields}</Stepper.Page>
            <Stepper.Page network={network}>{Review}</Stepper.Page>
          </Stepper>
        </Block>
      ) : (
        <div>No web3 provider detected</div>
      )}
    </React.Fragment>
  )
}

export default Layout

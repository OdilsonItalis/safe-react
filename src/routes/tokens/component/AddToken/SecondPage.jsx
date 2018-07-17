// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, required, mustBeInteger, mustBeUrl } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'

export const NAME_PARAM = 'tokenName'
export const SYMBOL_PARAM = 'tokenSymbol'
export const DECIMALS_PARAM = 'tokenDecimals'
export const LOGO_URL_PARAM = 'tokenLogo'

const SecondPage = () => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      Complete Custom Token information
    </Heading>
    <Block margin="md">
      <Field
        name={NAME_PARAM}
        component={TextField}
        type="text"
        validate={required}
        placeholder="ERC20 Token Name*"
        text="ERC20 Token Name"
      />
    </Block>
    <Block margin="md">
      <Field
        name={SYMBOL_PARAM}
        component={TextField}
        type="text"
        validate={required}
        placeholder="ERC20 Token Symbol*"
        text="ERC20 Token Symbol"
      />
    </Block>
    <Block margin="md">
      <Field
        name={DECIMALS_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeInteger)}
        placeholder="ERC20 Token Decimals*"
        text="ERC20 Token Decimals"
      />
    </Block>
    <Block margin="md">
      <Field
        name={LOGO_URL_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeUrl)}
        placeholder="ERC20 Token Logo url*"
        text="ERC20 Token Logo"
      />
    </Block>
  </Block>
)

export default SecondPage

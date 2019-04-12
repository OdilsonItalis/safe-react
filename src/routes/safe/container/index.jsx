// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/safe/component/Layout'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

export type Props = Actions &
  SelectorProps & {
    granted: boolean,
  }

const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 15000

class SafeView extends React.Component<Props> {
  componentDidMount() {
    const {
      fetchSafe, loadActiveTokens, activeTokens, safeUrl, fetchTokenBalances, safe,
    } = this.props

    fetchSafe(safeUrl)
    // loadActiveTokens(safeUrl)
    fetchTokenBalances(safe, activeTokens)

    this.intervalId = setInterval(() => {
      // update in another function so it uses up-to-date props values
      this.checkForUpdates()
    }, TIMEOUT)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  checkForUpdates() {
    const {
      safeUrl, activeTokens, fetchSafe, fetchTokenBalances, safe,
    } = this.props

    fetchSafe(safeUrl, true)
    fetchTokenBalances(safe, activeTokens)
  }

  intervalId: IntervalID

  render() {
    const {
      safe, provider, activeTokens, granted, userAddress, network, tokens,
    } = this.props

    return (
      <Page>
        <Layout
          activeTokens={activeTokens}
          tokens={tokens}
          provider={provider}
          safe={safe}
          userAddress={userAddress}
          network={network}
          granted={granted}
        />
      </Page>
    )
  }
}

export default connect<Object, Object, ?Function, ?Object>(
  selector,
  actions,
)(SafeView)

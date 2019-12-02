import React, { Component } from 'react'
import Caver from 'caver-js'

import Nav from 'components/Nav'
import WalletInfo from 'components/WalletInfo'
import Dropdown from 'components/Dropdown'
import ValueTransfer from 'components/ValueTransfer'
import SmartContractDeploy from 'components/SmartContractDeploy'
import AddToken from 'components/AddToken'
import SmartContractExecution from 'components/SmartContractExecution'
import ValueTransferFD from 'components/ValueTransferFD'
import SmartContractExecutionFD from 'components/SmartContractExecutionFD'
import AccountUpdate from 'components/AccountUpdate'
import SignTransaction from 'components/SignTransaction'
import Cancel from 'components/Cancel'
import SignMessage from 'components/SignMessage'

import './KaikasPage.scss'

const txTypeList = [
  'Value Transfer',
  'Smart Contract Deploy',
  'Add Token',
  'Token Transfer',
  'Cancel',
  'Sign Transaction',
  'Sign Message',
  'Value Transfer (Fee Delegation)',
  'Value Transfer with Memo (Fee Delegation)',
  'Token Transfer (Fee Delegation)',
  'Token Transfer (Fee Delegation with Ratio)',
  'Account Update',
  'Account Update (Fee Delegation)',
  'Contract Example: Count App',
]

class KaikasPage extends Component {
  constructor(props) {
    super(props)
    this.caver = null
    this.state = {
      txType: null,
      account: '',
      balance: 0,
      network: null,
    }
  }
  
  componentDidMount() {
    this.loadAccountInfo()
    this.setNetworkInfo()
  }

  setAccountInfo = async (provider) => {
    const account = provider.selectedAddress
    const balance = await this.caver.klay.getBalance(account)
    this.setState({
      account,
      balance: this.caver.utils.fromPeb(balance, 'KLAY'),
    })
  }

  // TODO: Internet no connection
  setNetworkInfo = () => {
    const { klaytn } = window
    if(klaytn === undefined) return

    this.setState({ network: klaytn.networkVersion })
    klaytn.on('networkChanged', () => this.setNetworkInfo(klaytn.networkVersion))
  }

  loadAccountInfo = async () => {
    const { klaytn } = window

    // 1. Modern dapp browsers...
    if (klaytn) {
      this.caver = new Caver(klaytn)
      try {
        await klaytn.enable()
        this.setAccountInfo(klaytn)
        klaytn.on('accountsChanged', () => this.setAccountInfo(klaytn))
      } catch (error) {
        console.log('User denied account access')
      }
    }
    // 2. Legacy dapp browsers...
    else if (window.caver) {
      this.caver = new Caver(window.caver.currentProvider)
      this.setAccountInfo(this.caver)
    }
    // 3. Non-dapp browsers...
    else {
      console.log('Non-Klaytn browser detected. You should consider trying MetaMask!')
    }
  }

  selectTxType = (txType) => this.setState({ txType })

  renderTxExample = (txType, from) => {
    switch (txType) {
      case 'Value Transfer':
        return <ValueTransfer from={from} />
      case 'Smart Contract Deploy':
        return <SmartContractDeploy from={from} />
      case 'Token Transfer':
        return <SmartContractExecution from={from} />
      case 'Add Token':
          return <AddToken />
      case 'Cancel':
          return <Cancel from={from} />
      case 'Sign Transaction':
          return <SignTransaction from={from} />
      case 'Sign Message':
          return <SignMessage from={from} />
      case 'Value Transfer (Fee Delegation)':
        return <ValueTransferFD from={from} />
      case 'Value Transfer with Memo (Fee Delegation)':
        return <ValueTransferFD from={from} isMemo />
      case 'Token Transfer (Fee Delegation)':
        return <SmartContractExecutionFD from={from} />
      case 'Token Transfer (Fee Delegation with Ratio)':
        return <SmartContractExecutionFD from={from} feeRatio />
      case 'Account Update':
          return <AccountUpdate from={from} />
      case 'Account Update (Fee Delegation)':
          return <AccountUpdate from={from} isFeeDelegation />
      case 'Contract Example: Count App':
        return 'Count App Example'
      default:
        return (<p className="KaikasPage__guide">Select A Transaction Example :)</p>)
    }
  }

  render() {
    const { account, balance, txType, network } = this.state
    return (
      <div className="KaikasPage">
        <Nav network={network} />
        <div className="KaikasPage__main">
          <WalletInfo address={account} balance={balance} />
          <div className="KaikasPage__content">
            <Dropdown
              className="KaikasPage__dropdown"
              placeholder="Select Transaction type"
              selectedItem={txType}
              handleSelect={this.selectTxType}
              list={txTypeList}
            />
            <div className="KaikasPage__txExample">
              <h2 className="KaikasPage__txExampleTitle">{txType}</h2>
              {this.renderTxExample(txType, account)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default KaikasPage

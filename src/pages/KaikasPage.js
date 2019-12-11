import React, { Component } from 'react'
import Caver from 'caver-js'

import Nav from 'components/Nav'
import WalletInfo from 'components/WalletInfo'
import Dropdown from 'components/Dropdown'
import ValueTransfer from 'components/ValueTransfer'
import ValueTransferLegacy from 'components/ValueTransferLegacy'
import SmartContractDeployLegacy from 'components/SmartContractDeployLegacy'
import SmartContractDeploy from 'components/SmartContractDeploy'
import SmartContractDeployFD from 'components/SmartContractDeployFD'
import AddToken from 'components/AddToken'
import SmartContractExecutionLegacy from 'components/SmartContractExecutionLegacy'
import SmartContractExecution from 'components/SmartContractExecution'
import ValueTransferFD from 'components/ValueTransferFD'
import ValueTransferFDR from 'components/ValueTransferFDR'
import SmartContractExecutionFD from 'components/SmartContractExecutionFD'
import AccountUpdate from 'components/AccountUpdate'
import SignTransaction from 'components/SignTransaction'
import SendSignedTransaction from 'components/SendSignedTransaction'
import Cancel from 'components/Cancel'
import CancelFD from 'components/CancelFD'
import SignMessage from 'components/SignMessage'

import './KaikasPage.scss'

const txTypeList = [
  'Value Transfer (Legacy)',
  'Smart Contract Deploy (Legacy)',
  'Token Transfer (Legacy)',
  'Add Token',
  'Sign Message',
  'Sign Transaction',
  'Send Signed Transaction',
  'Value Transfer',
  'Value Transfer (Fee Delegation)',
  'Value Transfer (Fee Delegation with Ratio)',
  'Value Transfer with Memo',
  'Value Transfer with Memo (Fee Delegation)',
  'Value Transfer with Memo (Fee Delegation with Ratio)',
  'Account Update',
  'Account Update (Fee Delegation)',
  'Account Update (Fee Delegation with Ratio)',
  'Smart Contract Deploy',
  'Smart Contract Deploy (Fee Delegation)',
  'Smart Contract Deploy (Fee Delegation with Ratio)',
  'Token Transfer',
  'Token Transfer (Fee Delegation)',
  'Token Transfer (Fee Delegation with Ratio)',
  'Cancel',
  'Cancel (Fee Delegation)',
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
      case 'Value Transfer (Legacy)':
        return <ValueTransferLegacy from={from} />
      case 'Smart Contract Deploy (Legacy)':
        return <SmartContractDeployLegacy from={from} />
      case 'Token Transfer (Legacy)':
        return <SmartContractExecutionLegacy from={from} />
      case 'Add Token':
          return <AddToken />
      case 'Sign Transaction':
          return <SignTransaction from={from} />
      case 'Send Signed Transaction':
          return <SendSignedTransaction />
      case 'Sign Message':
          return <SignMessage from={from} />
      case 'Cancel':
          return <Cancel from={from} />
      case 'Cancel (Fee Delegation)':
          return <CancelFD from={from} />
      case 'Value Transfer':
        return <ValueTransfer from={from} />
      case 'Value Transfer (Fee Delegation)':
        return <ValueTransferFD from={from} />
      case 'Value Transfer (Fee Delegation with Ratio)':
        return <ValueTransferFDR from={from} />
      case 'Value Transfer with Memo':
        return <ValueTransfer from={from} isMemo />
      case 'Value Transfer with Memo (Fee Delegation)':
        return <ValueTransferFD from={from} isMemo />
      case 'Value Transfer with Memo (Fee Delegation with Ratio)':
        return <ValueTransferFDR from={from} isMemo />
      case 'Smart Contract Deploy':
        return <SmartContractDeploy from={from} />
      case 'Smart Contract Deploy (Fee Delegation)':
        return <SmartContractDeployFD from={from} />
      case 'Smart Contract Deploy (Fee Delegation with Ratio)':
        return <SmartContractDeployFD from={from} feeRatio />
      case 'Token Transfer':
        return <SmartContractExecution from={from} />
      case 'Token Transfer (Fee Delegation)':
        return <SmartContractExecutionFD from={from} />
      case 'Token Transfer (Fee Delegation with Ratio)':
        return <SmartContractExecutionFD from={from} feeRatio />
      case 'Account Update':
          return <AccountUpdate from={from} />
      case 'Account Update (Fee Delegation)':
          return <AccountUpdate from={from} isFeeDelegation />
      case 'Account Update (Fee Delegation with Ratio)':
          return <AccountUpdate from={from} isFeeDelegation feeRatio />
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

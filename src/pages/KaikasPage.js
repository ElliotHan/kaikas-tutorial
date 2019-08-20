import React, { Component } from 'react'
import Caver from 'caver-js'
import Web3 from 'web3'
import { isEmpty } from 'lodash'

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

import './KaikasPage.scss'

const txTypeList = [
  'Account Update',
  'Value Transfer',
  'Smart Contract Deploy',
  'Add Token',
  'Token Transfer',
  'Value Transfer (Fee Delegation)',
  'Token Transfer (Fee Delegation)',
  'Count App',
]

class KaikasPage extends Component {
  constructor(props) {
    super(props)
    this.caver = null
    this.state = {
      txType: null,
      account: 'Login with Kaikas :)',
      balance: 0,
      network: null,
    }
  }
  
  componentDidMount() {
    const { ethereum } = window
    const web3 = new Web3(ethereum)

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

  setNetworkInfo = () => {
    const { klaytn } = window
    if(isEmpty(klaytn)) return

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
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  selectTxType = (txType) => this.setState({ txType })

  renderTxExample = (txType, from) => {
    switch (txType) {
      case 'Account Update':
        return <AccountUpdate from={from} />
      case 'Add Token':
        return <AddToken />
      case 'Value Transfer':
        return <ValueTransfer from={from} />
      case 'Smart Contract Deploy':
        return <SmartContractDeploy from={from} />
      case 'Token Transfer':
        return <SmartContractExecution from={from} />
      case 'Value Transfer (Fee Delegation)':
        return <ValueTransferFD from={from} />
      case 'Token Transfer (Fee Delegation)':
        return <SmartContractExecutionFD />
      case 'Count App':
        return 'Count App Example'
      default:
        return 'Select Transaction Example :)'
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
              {txType
                ? this.renderTxExample(txType, account)
                : <p className="KaikasPage__guide">Select Transaction Example :)</p>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default KaikasPage

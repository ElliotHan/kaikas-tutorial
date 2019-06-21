import React, { Component } from 'react'
import Web3 from 'web3'

import Nav from 'components/Nav'
import WalletInfo from 'components/WalletInfo'
import Dropdown from 'components/Dropdown'
import ValueTransfer from 'components/ValueTransfer'
import SmartContractDeploy from 'components/SmartContractDeploy'
import AddToken from 'components/AddToken'
import SmartContractExecution from 'components/SmartContractExecution'
import ValueTransferFD from 'components/ValueTransferFD'
import SmartContractExecutionFD from 'components/SmartContractExecutionFD'

import './KaikasPage.scss'

const txTypeList = [
  'Value Transfer',
  'Smart Contract Deploy',
  'Add Token',
  'Token Transfer',
  'Value Transfer (Fee Delegation)',
  'Token Transfer (Fee Delegation)',
]

class KaikasPage extends Component {
  constructor(props) {
    super(props)
    this.web3 = null
    this.state = {
      txType: null,
      account: 'Login with Kaikas :)',
      balance: 0,
    }
    this.loadAccountInfo()
  }

  setAccountInfo = async (provider) => {
    const account = provider.selectedAddress
    const balance = await this.web3.eth.getBalance(account)
    this.setState({
      account,
      balance: this.web3.utils.fromWei(balance, 'ether'),
    })
  }

  loadAccountInfo = async () => {
    const { ethereum } = window

    // 1. Modern dapp browsers...
    if (ethereum) {
      this.web3 = new Web3(ethereum)
      try {
        await ethereum.enable()
        this.setAccountInfo(ethereum)
        ethereum.on('accountsChanged', () => this.setAccountInfo(ethereum))
      } catch (error) {
        console.log('User denied account access')
      }
    }
    // 2. Legacy dapp browsers...
    else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider)
      this.setAccountInfo(this.web3)
    }
    // 3. Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  selectTxType = (txType) => this.setState({ txType })

  renderTxExample = (txType, from) => {
    switch (txType) {
      case 'Add Token':
        return <AddToken />
      case 'Value Transfer':
        return <ValueTransfer from={from} />
      case 'Smart Contract Deploy':
        return <SmartContractDeploy from={from} />
      case 'Token Transfer':
        return <SmartContractExecution from={from} />
      case 'Value Transfer (Fee Delegation)':
        return <ValueTransferFD />
      case 'Token Transfer (Fee Delegation)':
        return <SmartContractExecutionFD />
      default:
        return 'Select Transaction Example :)'
    }
  }

  render() {
    const { account, balance, txType } = this.state
    return (
      <div className="KaikasPage">
        <Nav />
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

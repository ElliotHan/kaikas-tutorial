import React, { Component } from 'react'
import Web3 from 'web3'
import { isEmpty } from 'lodash'
import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'
import Message from 'components/Message'
import './AccountUpdate.scss'

class AccountUpdate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      publicKey: '',
      gas: '300000',
      txHash: null,
      receipt: null,
      error: null,
      privateKey: '',
      publicKey: '',
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.from !== prevState.from) {
      return { from: nextProps.from }
    }
    return null
  }

  handleGenerateNewPublicKey = () => {
    const { privateKey } = caver.klay.accounts.create()
    const publicKey = caver.klay.accounts.privateKeyToPublicKey(privateKey)
    this.setState({ privateKey, publicKey })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleUpdateAccount = () => {
    const { from, gas, publicKey } = this.state
    console.log('tx', JSON.stringify({
      type: 'ACCOUNT_UPDATE',
      from,
      publicKey,
      gas,
    }))
    caver.klay.sendTransaction({
        type: 'ACCOUNT_UPDATE',
        from,
        publicKey,
        gas,
    })
      .once('transactionHash', (transactionHash) => {
          console.log('txHash', transactionHash)
          this.setState({ txHash: transactionHash })
      })
      .once('receipt', (receipt) => {
          console.log('receipt', receipt)
          this.setState({ receipt: JSON.stringify(receipt) })
      })
      .once('error', (error) => {
          console.log('error', error)
          this.setState({ error: error.message })
      })
  }

  render() {
    const {
      from,
      to,
      value,
      senderRawTransaction,
      feePayerAddress,
      feePayerPrivateKey,
      txHash,
      receipt,
      error,
      gas,
      privateKey,
      publicKey,
      walletKey = '',
    } = this.state
    return (
      <div className="AccountUpdate">
        <h2>Account Update</h2>
        <div className="AccountUpdate__walletKey">
          <h3>Wallet Key</h3>
          {isEmpty(walletKey) ? '-' : walletKey}
        </div>
        <div className="AccountUpdate__generatePublicKey">
          <Input
            name="publicKey"
            label="Publickey"
            value={publicKey}
            placeholder="Generate new publicKey for Account update"
            readOnly
          />
          <Input
            name="privateKey"
            label="privateKey"
            value={privateKey}
            placeholder="Generate new privateKey for Account update"
            readOnly
          />
          <Button
            title="Generate new publicKey"
            onClick={this.handleGenerateNewPublicKey}
          />
        </div>
        <div className="AccountUpdate__sender">
          <Input
            name="from"
            label="From"
            value={from}
            placeholder="From Address"
            readOnly
          />
          <Input
            name="publicKey"
            label="PublicKey"
            value={publicKey}
            onChange={this.handleChange}
            placeholder="publicKey Address"
          />
          <Input
            name="gas"
            label="Gas"
            value={gas}
            onChange={this.handleChange}
            placeholder="Gas"
          />
          <Button
            title="Account Update"
            onClick={this.handleUpdateAccount}
          />
          <TxResult
            txHash={txHash}
            receipt={receipt}
            error={error}
          />
        </div>
        
      </div>
    )
  }
}

export default AccountUpdate

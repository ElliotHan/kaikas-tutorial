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
      walletKey: '',
      gas: '300000',
      txHash: null,
      receipt: null,
      error: null,
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.from !== prevState.from) {
      return { from: nextProps.from }
    }
    return null
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleGenerateKeypair = () => {
    const { privateKey } = caver.klay.accounts.create()
    const publicKey = caver.klay.accounts.privateKeyToPublicKey(privateKey)
    const walletKey = `${privateKey}0x00${this.state.from}`
    this.setState({ publicKey, walletKey })
  }

  handleUpdateAccount = () => {
    const { from, gas, publicKey } = this.state

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
      publicKey,
      walletKey,
      gas,
      txHash,
      receipt,
      error,
    } = this.state
    return (
      <div className="AccountUpdate">
        <div className="AccountUpdate__generateKeypair">
          <Button
            className="AccountUpdate__generateButton"
            title="Generate New Keypair"
            onClick={this.handleGenerateKeypair}
          />
          {/* <Input
            name="publicKey"
            label="New Public Key"
            value={publicKey}
            placeholder="Generate new publicKey for Account update"
            readOnly
          /> */}
          <Input
            name="walletKey"
            label="New Wallet Key"
            value={walletKey}
            placeholder="Generate new Wallet Key for Account update"
            readOnly
          />
        </div>
        <div className="AccountUpdate__transaction">
          <Input
            name="from"
            label="From"
            value={from}
            placeholder="Login with Kaikas :)"
            readOnly
          />
          <Input
            name="publicKey"
            label="New Public Key"
            value={publicKey}
            onChange={this.handleChange}
            placeholder="New Public Key"
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
        </div>
        <TxResult
          txHash={txHash}
          receipt={receipt}
          error={error}
        />
      </div>
    )
  }
}

export default AccountUpdate

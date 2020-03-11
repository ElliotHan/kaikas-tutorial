import React, { Component } from 'react'
import Web3 from 'web3'
import { isEmpty } from 'lodash'
import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'
import Message from 'components/Message'
import './AccountUpdate.scss'
import FeeDelegation from './FeeDelegation';

class AccountUpdate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      publicKey: '',
      walletKey: '',
      ratio: '',
      gas: 3000000,
      txHash: null,
      receipt: null,
      error: null,
      senderRawTransaction: null,
    }
  }

  // static getDerivedStateFromProps = (nextProps, prevState) => {
  //   if (nextProps.from !== prevState.from) {
  //     return { from: nextProps.from }
  //   }
  //   return null
  // }

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

  signTransaction = async () => {
    const { from, gas, publicKey, ratio } = this.state

    const txData = {
      type: this.props.feeRatio? 'FEE_DELEGATED_ACCOUNT_UPDATE_WITH_RATIO' : 'FEE_DELEGATED_ACCOUNT_UPDATE',
      from,
      publicKey,
      gas,
    }

    if (this.props.feeRatio) {
      txData.feeRatio = ratio
    }

    const { rawTransaction: senderRawTransaction } = await caver.klay.signTransaction(txData)
    this.setState({
      senderAddress: from,
      senderRawTransaction,
    })
  }

  updateAccount = () => {
    console.log('send')
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
      ratio,
      gas,
      txHash,
      receipt,
      error,
      senderRawTransaction,
    } = this.state
    const { isFeeDelegation } = this.props
    return (
      <div className="AccountUpdate">
        <div className="AccountUpdate__generateKeypair">
          <Button
            className="AccountUpdate__generateButton"
            title="Generate New Keypair"
            onClick={this.handleGenerateKeypair}
          />
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
            onChange={this.handleChange}
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
          {this.props.feeRatio && (
            <Input
              name="ratio"
              label="Fee Ratio"
              value={ratio}
              onChange={this.handleChange}
              placeholder="Fee Ratio (%)"
            />
          )}
          <Button
            title="Account Update"
            onClick={isFeeDelegation ? this.signTransaction : this.updateAccount}
          />
          {senderRawTransaction && (
            <Message
              type="rawTransaction"
              message={JSON.stringify(senderRawTransaction)}
            />
          )}
        </div>
        {isFeeDelegation
          ? (
            <FeeDelegation
              senderRawTransaction={senderRawTransaction}
              feePayerAddress={from}
            />
          )
          : (
            <TxResult
              txHash={txHash}
              receipt={receipt}
              error={error}
            />
          )}
      </div>
    )
  }
}

export default AccountUpdate

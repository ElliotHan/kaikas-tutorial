import React, { Component } from 'react'
import Caver from 'caver-js'
import Web3 from 'web3'
import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'
import Message from 'components/Message'
import './ExampleTemplate.scss'

class ExampleTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,

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

  handleExampleTemplate = async () => {
    const caver = new Caver(klaytn)
    const { from, to, value, memo, feePayerAddress, feePayerPrivateKey } = this.state

    const signedTransaction = await caver.klay.signTransaction({
      type: this.props.isMemo ? 'FEE_DELEGATED_VALUE_TRANSFER_MEMO' : 'FEE_DELEGATED_VALUE_TRANSFER_WITH_RATIO',
      from,
      to,
      data: memo,
      gas: '300000',
      value: caver.utils.toPeb(value, 'KLAY'),
    })
    const senderRawTransaction = signedTransaction.rawTransaction
    this.setState({ senderRawTransaction })
  }

  handelSendTransactionFromFeePayer = () => {
    const caver = new Caver(klaytn)
    const { feePayerAddress, feePayerPrivateKey, senderRawTransaction } = this.state

    caver.klay.accounts.wallet.add(feePayerPrivateKey, feePayerAddress)

    caver.klay.sendTransaction({
      senderRawTransaction,
      feePayer: feePayerAddress,
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
      memo,
      senderRawTransaction,
      feePayerAddress,
      feePayerPrivateKey,
      txHash,
      receipt,
      error,
    } = this.state
    const { inputs, guide, isFeeDelegation } = this.props
    return (
      <div className="ExampleTemplate">
        {guide && (<p className="ExampleTemplate__guide">{guide}</p>)}
        
        <div className="ExampleTemplate__sender">
          <Input
            name="from"
            label="From"
            value={from}
            placeholder="From Address"
            readOnly
          />
          <Input
            name="to"
            label="To"
            value={to}
            onChange={this.handleChange}
            placeholder="To Address"
          />
          <Input
            name="value"
            label="Value"
            value={value}
            onChange={this.handleChange}
            placeholder="Value (KLAY)"
          />
          {this.props.isMemo && (
            <Input
              name="memo"
              label="Memo"
              value={memo}
              onChange={this.handleChange}
              placeholder="Memo"
            />
          )}
          <Button
            title="Sign Transaction"
            onClick={this.handleExampleTemplate}
          />
          {senderRawTransaction && (
            <Message
              type="rawTransaction"
              message={senderRawTransaction}
            />
          )}
        </div>
        <div className="ExampleTemplate__feePayer">
          <h3>Fee Payer</h3>
          <Input
            name="feePayerAddress"
            label="Fee Payer Address (임시 Input. 추후 Kaikas내에 내장될 것으로 예상)"
            value={feePayerAddress}
            onChange={this.handleChange}
            placeholder="Fee Payer Address"
            readOnly
          />
          <Input
            name="feePayerPrivateKey"
            label="Fee Payer PrivateKey (임시 Input. 추후 Kaikas내에 내장될 것으로 예상)"
            value={feePayerPrivateKey}
            onChange={this.handleChange}
            placeholder="Fee Payer PrivateKey"
            readOnly
          />
          
          <Button
            title="Send Transaction"
            onClick={this.handelSendTransactionFromFeePayer}
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

export default ExampleTemplate

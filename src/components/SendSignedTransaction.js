import React, { Component } from 'react'
import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'

import './SignTransaction.scss'

class SendSignedTransaction extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rawTransaction: '',
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

  sendSignTransaction = async () => {
    const { rawTransaction } = this.state
    caver.klay.sendSignedTransaction(rawTransaction)
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
      rawTransaction,
      txHash,
      receipt,
      error
    } = this.state

    return (
      <div className="SignTransaction">
        <div className="SignTransaction__sender">
          <Input
            name="rawTransaction"
            label="RawTransaction"
            value={rawTransaction}
            onChange={this.handleChange}
            placeholder="RLP-encoded transaction string(RawTransaction)"
          />
          <Button
            title="Send Signed Transaction"
            onClick={this.sendSignTransaction}
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

export default SendSignedTransaction

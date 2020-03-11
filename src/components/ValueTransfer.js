import React, { Component } from 'react'
import Caver from 'caver-js'

import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'

import './ValueTransfer.scss'

class ValueTransfer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      to: '',
      value: '',
      memo: '',
      gas: '3000000',
      txHash: null,
      receipt: null,
      error: null,
      rawTransaction: null,
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

  handleValueTransfer = () => {
    const caver = new Caver(klaytn)
    const { from, to, value, memo, gas } = this.state

    const dataMemo = memo === '' ? {} : { data: memo }

    caver.klay.sendTransaction({
      type: this.props.isMemo ? 'VALUE_TRANSFER_MEMO' : 'VALUE_TRANSFER',
      from,
      to,
      value: caver.utils.toPeb(value.toString(), 'KLAY'),
      gas,
      ...dataMemo,
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
    const { isFeeDelegation, rawTransaction } = this.props
    const { from, to, value, gas, memo, txHash, receipt, error } = this.state
    return (
      <div className="ValueTransfer">
        <Input
          name="from"
          label="From"
          value={from}
          onChange={this.handleChange}
          placeholder="From Address"
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
        <Input
          name="gas"
          label="Gas"
          value={gas}
          onChange={this.handleChange}
          placeholder="Gas (Peb)"
        />
        <Button
          title={isFeeDelegation ? 'Sign Transaction' : 'Send KLAY'}
          onClick={this.handleValueTransfer}
          // onClick={isFeeDelegation ? this.signTransaction : this.handleValueTransfer}
        />
        {rawTransaction && (
          <Message
            type="rawTransaction"
            message={JSON.stringify(rawTransaction)}
          />
        )}
        {!isFeeDelegation && (
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

export default ValueTransfer

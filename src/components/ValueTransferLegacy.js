import React, { Component } from 'react'
import Caver from 'caver-js'

import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'

import './ValueTransfer.scss'

class ValueTransferLegacy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      to: '',
      value: '',
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

    caver.klay.sendTransaction({
      from,
      to,
      value: caver.utils.toPeb(value.toString(), 'KLAY'),
      data: memo,
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

  signTransaction = async () => {
    const { from, to, value, memo, gas } = this.state
    const { rawTransaction } = await caver.klay.signTransaction({
      from,
      to,
      value,
      data: memo,
      gas,
    })
    this.setState({ rawTransaction })
  }

  render() {
    const { isFeeDelegation, rawTransaction } = this.props
    const { from, to, value, gas, txHash, receipt, error } = this.state
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

export default ValueTransferLegacy

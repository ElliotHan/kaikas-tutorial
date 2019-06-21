import React, { Component } from 'react'
import Web3 from 'web3'

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

  handleValueTransfer = () => {
    const web3 = new Web3(ethereum)
    const { from, to, value } = this.state

    web3.eth.sendTransaction({
      from,
      to,
      value: web3.utils.toWei(value.toString(), 'ether'),
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
    const { from, to, value, txHash, receipt, error } = this.state
    return (
      <div className="ValueTransfer">
        <h2>Value Transfer</h2>
        <Input
          name="from"
          label="From"
          value={from}
          onChange={this.handleChange}
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
          placeholder="Value (ETH)"
        />
        <Button
          title="Value Transfer"
          onClick={this.handleValueTransfer}
        />
        <TxResult
          txHash={txHash}
          receipt={receipt}
          error={error}
        />
      </div>
    )
  }
}

export default ValueTransfer

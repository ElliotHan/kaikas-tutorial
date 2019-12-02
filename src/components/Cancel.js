import React, { Component } from 'react'
import Caver from 'caver-js'
import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'

class Cancel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      nonce: null,
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

  handleCancel = () => {
    const caver = new Caver(klaytn)
    const { from, nonce } = this.state
    caver.klay.sendTransaction({
      type: 'CANCEL',
      from,
      nonce,
      gas: '300000',
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
    const { from, nonce, txHash, receipt, error } = this.state
    return (
      <div className="ValueTransfer">
        <Input
          name="from"
          label="From"
          value={from}
          onChange={this.handleChange}
          placeholder="From Address"
          readOnly
        />
        <Input
          name="nonce"
          label="Nonce"
          value={nonce}
          onChange={this.handleChange}
          placeholder="Nonce to cancel transaction"
        />
        {/* <Input
          name="gas"
          label="Gas"
          value={gas}
          onChange={this.handleChange}
          placeholder="Gas (Peb)"
        /> */}
        <Button
          title="Cancel Transaction"
          onClick={this.handleCancel}
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

export default Cancel
